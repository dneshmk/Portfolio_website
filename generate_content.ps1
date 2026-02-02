# Set output file
$outputFile = "cms_data.js"

# Helper function to read text file content
function Get-TextContent {
    param ($path)
    if (Test-Path $path) {
        return (Get-Content $path -Raw).Trim()
    }
    return ""
}

# Helper function to get images/videos (returns array of strings)
function Get-MediaFiles {
    param ($path, $type)
    if (Test-Path $path) {
        if ($type -eq "image") {
            $files = Get-ChildItem -Path $path -Include *.jpg, *.jpeg, *.png, *.svg, *.gif -Recurse
        } else {
            $files = Get-ChildItem -Path $path -Include *.mp4, *.webm, *.ogg -Recurse
        }
        
        $relativePaths = @()
        foreach ($file in $files) {
            # Convert absolute path to relative web path (forward slashes)
            $relPath = $file.FullName.Substring($PSScriptRoot.Length + 1).Replace("\", "/")
            $relativePaths += $relPath
        }
        return $relativePaths
    }
    return @()
}

# --- BUILD DATA OBJECT ---
Write-Host "Scaning folders..."

# 1. HERO SECTION
$heroVidFiles = @(Get-MediaFiles "hero-section/main-hero/videos" "video")
$heroObj = @{
    headline    = Get-TextContent "hero-section/main-hero/headline.txt"
    description = Get-TextContent "hero-section/main-hero/description.txt"
    video       = if ($heroVidFiles.Count -gt 0) { $heroVidFiles[0] } else { "" }
}

# 2. PROFILE SECTION
$profImgFiles = @(Get-MediaFiles "profile/profile-picture" "image")
$profileObj = @{
    name  = Get-TextContent "profile/name.txt"
    bio   = Get-TextContent "profile/bio.txt"
    image = if ($profImgFiles.Count -gt 0) { $profImgFiles[0] } else { "" }
}

# 3. SKILLS SECTION
$skillsListRaw = Get-TextContent "skills/list.txt"
$skillsList = if ($skillsListRaw) { @($skillsListRaw -split "`r`n" | Where-Object { $_ -ne "" }) } else { @() }
$skillsObj = @{
    list  = $skillsList
    icons = @(Get-MediaFiles "skills/images" "image")
}

# 4. PROJECTS (WORK)
$projectsList = @()
$categories = Get-ChildItem -Path "work" -Directory

foreach ($cat in $categories) {
    if ($cat.Name -eq "images" -or $cat.Name -eq "videos") { continue } # Skip legacy folders if any

    $subProjects = Get-ChildItem -Path $cat.FullName -Directory
    
    foreach ($proj in $subProjects) {
        $projDesc = Get-TextContent "$($proj.FullName)/description.txt"
        $projTitle = Get-TextContent "$($proj.FullName)/title.txt"
        
        if (-not $projTitle) {
            $projTitle = (Get-Culture).TextInfo.ToTitleCase($proj.Name.Replace("-", " "))
        }

        $images = @(Get-MediaFiles "$($proj.FullName)/images" "image")
        $videos = @(Get-MediaFiles "$($proj.FullName)/videos" "video")
        
        # Combine gallery - enforce array
        $gallery = $images + $videos
        
        # Main image
        $mainImage = if ($images.Count -gt 0) { $images[0] } else { "" }

        $projectsList += @{
            id          = $proj.Name
            category    = $cat.Name
            title       = $projTitle
            description = $projDesc
            image       = $mainImage
            gallery     = $gallery
        }
    }
}

# Construct Final Object
$cmsData = @{
    hero     = $heroObj
    profile  = $profileObj
    skills   = $skillsObj
    projects = $projectsList
}

# Convert to JSON with depth to ensure full object tree is preserved
$jsonContent = $cmsData | ConvertTo-Json -Depth 10

# Wrap in Javascript const
$finalJs = "const cmsData = $jsonContent;"

# Write to file
Set-Content -Path $outputFile -Value $finalJs -Encoding UTF8
Write-Host "Successfully generated $outputFile"

