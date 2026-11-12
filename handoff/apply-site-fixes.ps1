param([string]$SitePath = 'C:\Users\guven\projects\site')
$ErrorActionPreference = 'Stop'
$sourceRoot = Split-Path -Parent $PSScriptRoot
$siteRoot = (Resolve-Path -LiteralPath $SitePath).Path
$patchPath = Join-Path $PSScriptRoot 'site-showcase.patch'
if (Test-Path -LiteralPath (Join-Path $siteRoot 'e2e/site-showcase.spec.ts')) {
    throw 'The destination regression test already exists. Review it before replacing it.'
}
$gitRoot = (& git -C $siteRoot rev-parse --show-toplevel).Trim()
if ($LASTEXITCODE -ne 0 -or [IO.Path]::GetFullPath($gitRoot) -ne $siteRoot) {
    throw 'SitePath must be the root of the intended website repository.'
}
# Preserve any local edits to the exported assets.
$assetEdits = & git -C $siteRoot status --porcelain -- public/guven/mirror
if ($assetEdits) { throw 'The destination mirror assets have local changes. Review them before applying this update.' }
& git -C $siteRoot apply --check $patchPath
if ($LASTEXITCODE -ne 0) { throw 'The patch does not match this checkout. No changes were applied.' }
& git -C $siteRoot apply $patchPath
if ($LASTEXITCODE -ne 0) { throw 'The patch could not be applied.' }
$assetPath = Join-Path $siteRoot 'public/guven/mirror'
New-Item -ItemType Directory -Force -Path $assetPath | Out-Null
foreach ($asset in @('mirror.glb', 'poster.png', 'model-info.json')) {
    Copy-Item -LiteralPath (Join-Path $sourceRoot "public/mirror/$asset") -Destination (Join-Path $assetPath $asset)
}
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'site-showcase.spec.ts') -Destination (Join-Path $siteRoot 'e2e/site-showcase.spec.ts')
Write-Output 'Applied the local website changes and matching assets. Nothing was committed, pushed or deployed.'
Write-Output 'Next run npm test, npm run lint, npm run build and the browser tests in the website project.'
