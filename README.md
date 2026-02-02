# File-System CMS Guide

**Welcome to your content-managed website!**
You can now update your website by simply editing text files and organizing folders. No coding required.

## 🚀 How to Update Your Website

1.  **Make your changes** (Add folders, edit text, replace images).
2.  **Double-click `Update-Website.bat`**.
3.  **Refresh your browser**.

---

## 📂 Content Structure

### **1. Work (Projects)**
Path: `work/{Category}/{Project-Name}/`

To add a new project, simply create a new folder here.
Inside the project folder, you **must** have:
-   `description.txt`: The text describing the project.
-   `images/`: Put your images here. The first one becomes the thumbnail.
-   `videos/`: Put your videos here.

*Optional:* `title.txt` if you want a title different from the folder name.

### **2. Hero Section**
Path: `hero-section/main-hero/`
-   `headline.txt`: The big main text.
-   `description.txt`: The smaller text below it.
-   `images/hero.png`: The background image.
-   `videos/hero-background.mp4`: The background video.

### **3. Profile (About Me)**
Path: `profile/`
-   `name.txt`: Your display name.
-   `bio.txt`: Your main "About Me" paragraph.
-   `profile-picture/`: Put your profile photo here.

### **4. Skills**
Path: `skills/`
-   `list.txt`: A list of your skills (one per line).
-   `images/`: Software icons for the scrolling ticker.

---

## ⚠️ Important Rules
1.  **Don't rename the main folders** (`work`, `hero-section`, `profile`, `skills`).
2.  **Keep filenames simple**. Avoid special characters in folder names.
3.  **Always run `Update-Website.bat`** after making changes, or they won't show up!
