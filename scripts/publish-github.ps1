# Run from a normal terminal. This prepares and publishes the reviewed project.
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $false
$taskRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $taskRoot

function Invoke-GitStep {
    param([string[]] $GitArguments)
    & git @GitArguments
    if ($LASTEXITCODE -ne 0) { throw "Git failed: $($GitArguments[0]). Publication stopped." }
}

$taskLogin = & gh api user --jq .login
if ($LASTEXITCODE -ne 0) { throw 'GitHub CLI sign-in failed. Run gh auth login in this terminal, then retry.' }
if ($taskLogin.Trim() -ne 'guventech') { throw 'Sign in to the guventech account before publishing.' }

$taskOrigin = & git remote get-url origin 2>$null
$taskHasOrigin = $LASTEXITCODE -eq 0
if ($taskHasOrigin -and $taskOrigin -notmatch '^https://github\.com/guventech/door-mirror(?:\.git)?$|^git@github\.com:guventech/door-mirror(?:\.git)?$') {
    throw 'Origin points to another repository. Publication stopped.'
}

# Refuse to replace a pre-existing repository unless this checkout already owns
# its origin. This also lets a failed initial push be retried safely.
$taskRemoteUrl = & gh repo view guventech/door-mirror --json url --jq .url 2>$null
$taskRepoExists = $LASTEXITCODE -eq 0
if ($taskRepoExists -and -not $taskHasOrigin) {
    throw 'guventech/door-mirror already exists and is not linked to this checkout. Publication stopped.'
}

Invoke-GitStep -GitArguments @('add', '.')
& git diff --cached --quiet
$taskStagedExit = $LASTEXITCODE
if ($taskStagedExit -gt 1) { throw 'Could not inspect staged changes.' }
if ($taskStagedExit -eq 1) {
    Invoke-GitStep -GitArguments @('commit', '-m', 'feat: add evidence-backed door mirror teardown')
}

$taskBranch = (& git branch --show-current).Trim()
if ($taskBranch -ne 'main') {
    & git show-ref --verify --quiet refs/heads/main
    if ($LASTEXITCODE -eq 0) { throw 'A separate main branch already exists. Merge or switch deliberately before publishing.' }
    Invoke-GitStep -GitArguments @('switch', '-c', 'main')
}

if (-not $taskRepoExists) {
    & gh repo create guventech/door-mirror --public --source . --remote origin --push --description 'An original interactive door-mirror cost teardown with primary-source part insights.'
    if ($LASTEXITCODE -ne 0) { throw 'Repository creation or initial push failed. Check the output before retrying.' }
} else {
    $taskPrivate = & gh repo view guventech/door-mirror --json isPrivate --jq .isPrivate
    if ($LASTEXITCODE -ne 0 -or $taskPrivate.Trim() -ne 'false') { throw 'The target repository is not confirmed public. Publication stopped.' }
    Invoke-GitStep -GitArguments @('push', '-u', 'origin', 'main')
}

& gh repo view guventech/door-mirror --json url,isPrivate,defaultBranchRef
if ($LASTEXITCODE -ne 0) { throw 'Push completed but final remote verification failed.' }
Invoke-GitStep -GitArguments @('status', '--short', '--branch')
Write-Host 'Published the project. This checkout is on main.'
