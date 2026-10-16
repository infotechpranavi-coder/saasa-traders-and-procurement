import { access, mkdir, writeFile, copyFile } from 'fs/promises'
import { execSync } from 'child_process'
import path from 'path'
import { CONSTRUCTION_PHOTOS } from '@/lib/cms-images'
import { STATIC_MACHINERY_IMAGES } from '@/lib/static-machinery-images'

/** Local filenames in /public/static (and fallback /public/statsic) */
const STATIC_DOWNLOADS: Record<string, string> = {
  'jcb.jpg': CONSTRUCTION_PHOTOS.excavatorOrange,
  'batchmix.jpeg': CONSTRUCTION_PHOTOS.constructionSite,
  'road roller.jpg': CONSTRUCTION_PHOTOS.constructionWorkers,
  'drum mix.jpeg': CONSTRUCTION_PHOTOS.crane,
  'bitumen soreder.jpg': CONSTRUCTION_PHOTOS.miningTruck,
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

function restoreStatsicFromGit(): void {
  try {
    execSync('git checkout HEAD -- public/statsic/ public/static/', {
      cwd: process.cwd(),
      stdio: 'ignore',
    })
  } catch {
    // Not a git repo or files not tracked — fall through to download.
  }
}

export async function ensureStaticMachineryImages(): Promise<void> {
  const staticDir = path.join(process.cwd(), 'public', 'static')
  const statsicDir = path.join(process.cwd(), 'public', 'statsic')
  await mkdir(staticDir, { recursive: true })
  await mkdir(statsicDir, { recursive: true })

  const missing = await Promise.all(
    Object.keys(STATIC_DOWNLOADS).map(async (fileName) => ({
      fileName,
      exists: (await fileExists(path.join(staticDir, fileName))) || (await fileExists(path.join(statsicDir, fileName))),
    })),
  )

  if (missing.some((entry) => !entry.exists)) {
    restoreStatsicFromGit()
  }

  for (const [fileName, url] of Object.entries(STATIC_DOWNLOADS)) {
    const destStatic = path.join(staticDir, fileName)
    const destStatsic = path.join(statsicDir, fileName)

    if (!(await fileExists(destStatic)) && (await fileExists(destStatsic))) {
      await copyFile(destStatsic, destStatic).catch(() => {})
    } else if (!(await fileExists(destStatsic)) && (await fileExists(destStatic))) {
      await copyFile(destStatic, destStatsic).catch(() => {})
    } else if (!(await fileExists(destStatic))) {
      try {
        const res = await fetch(url)
        if (res.ok) {
          const buffer = Buffer.from(await res.arrayBuffer())
          await writeFile(destStatic, buffer)
          await writeFile(destStatsic, buffer)
        }
      } catch {
        // Best-effort
      }
    }
  }

  void STATIC_MACHINERY_IMAGES
}
