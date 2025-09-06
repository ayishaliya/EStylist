import os
import zipfile
import gdown

FILE_ID = "1qtaBpAd2s_owo_7zQeIQOhGhM4GjJxTF"
URL = f"https://drive.google.com/uc?id={FILE_ID}"
OUTPUT = "images.zip"
TARGET_DIR = os.path.join("client", "public", "images")

if os.path.exists(TARGET_DIR) and os.listdir(TARGET_DIR):
    print("✅ Images already exist. Skipping download.")
else:
    print("⬇️  Downloading dataset...")
    gdown.download(URL, OUTPUT, quiet=False)

    print("📦 Extracting...")
    os.makedirs(TARGET_DIR, exist_ok=True)
    with zipfile.ZipFile(OUTPUT, "r") as zip_ref:
        zip_ref.extractall(TARGET_DIR)

    # 🗑️ Remove zip
    if os.path.exists(OUTPUT):
        os.remove(OUTPUT)
        print(f"🗑️  Removed temporary file: {OUTPUT}")

    print("✅ Done! Images are in client/public/images/")
