import os
import json

def find_extra_files(json_path, folder_path):
    # JSON file load karna
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # JSON ke andar listed file names (sirf filename part nikal lenge)
    json_files = {os.path.basename(song["file"]) for song in data}

    # Folder ke andar actual mp3 files
    folder_files = {f for f in os.listdir(folder_path) if f.lower().endswith(".mp3")}

    # Jo files folder mein hain but json mein nahi
    extra_files = folder_files - json_files

    return extra_files


if __name__ == "__main__":
    # User se input lena
    json_path = input("Enter JSON file path: ").strip()
    folder_path = input("Enter folder path (with mp3 files): ").strip()

    if not os.path.isfile(json_path):
        print("❌ JSON file not found.")
    elif not os.path.isdir(folder_path):
        print("❌ Folder not found.")
    else:
        extra_files = find_extra_files(json_path, folder_path)
        if extra_files:
            print("\n🎵 Extra files in folder (not in JSON):")
            for f in extra_files:
                print(" -", f)
        else:
            print("\n✅ All files in folder are present in JSON.")
