import { access, mkdir, writeFile } from 'fs/promises'
import { execSync } from 'child_process'
import path from 'path'
import { CONSTRUCTION_PHOTOS } from '@/lib/cms-images'
import { STATIC_MACHINERY_IMAGES } from '@/lib/static-machinery-images'

/** Local filenames in /public/statsic — restored from git or curated photos when missing. */
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
    execSync('git checkout HEAD -- public/statsic/', {
      cwd: process.cwd(),
      stdio: 'ignore',
    })
  } catch {
    // Not a git repo or files not tracked — fall through to download.
  }
}

export async function ensureStaticMachineryImages(): Promise<void> {
  const statsicDir = path.join(process.cwd(), 'public', 'statsic')
  await mkdir(statsicDir, { recursive: true })

  const missing = await Promise.all(
    Object.keys(STATIC_DOWNLOADS).map(async (fileName) => ({
      fileName,
      exists: await fileExists(path.join(statsicDir, fileName)),
    })),
  )

  if (missing.some((entry) => !entry.exists)) {
    restoreStatsicFromGit()
  }

  for (const [fileName, url] of Object.entries(STATIC_DOWNLOADS)) {
    const dest = path.join(statsicDir, fileName)
    if (await fileExists(dest)) continue

    try {
      const res = await fetch(url)
      if (!res.ok) continue
      const buffer = Buffer.from(await res.arrayBuffer())
      await writeFile(dest, buffer)
    } catch {
      // Best-effort — user can restore from git manually.
    }
  }

  void STATIC_MACHINERY_IMAGES
}
