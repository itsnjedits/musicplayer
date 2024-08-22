import os

# Folder location
folder_path = r"Y:\WEB DEVELOPMENT\musicplayer\Thumbnails"

# List of image names to be modified
image_names = [
    "Thumbnails/Aadat -slowed - reverbed- Atif Aslam Kalyug-2005- full song.jpg",
    "Thumbnails/Baatein Ye Kabhi Na - Slowed - Reverb - - Arijit Singh Khamoshiyan Lyrics Lofi Titan Music.jpg",
    "Thumbnails/Bandeya - Arijit Singh Dil Juunglee Song Slowed and Reverb Lofi Mix.jpg",
    "Thumbnails/Banjara ♥️ - Slowed - Reverb Lyrics - Ek Villain Banjara Slowed Lyrical Video.jpg",
    "Thumbnails/Chale Aana -Slowed - Reverb- Armaan Malik Bollywood hindi lofi song.jpg",
    "Thumbnails/Channa Mereya -Slowed-Reverb- Song Lyrics Arijit Singh.jpg",
    "Thumbnails/Dard dilo ke - slowed-reverb- Mohamad irfaan.jpg",
    "Thumbnails/Hasi Ban Gaye -Slowed - Reverb- Song Ami Mishra Hamari Adhuri Kahani Lofi KD.jpg",
    "Thumbnails/Daru Badnam - 8D - Reverb - Music Girl.jpg",
    "Thumbnails/Hookah Bar -Lyrics- - Himesh Reshammiya Lofi Song Khiladi 786(1).jpg",
    "Thumbnails/Hua Hai Aaj Pehli Baar from Sanam Re -Slowed and Reverbed-.jpg",
    "Thumbnails/Humnava Mere -Slowed-Reverb- Song Lyrics Jubin Nautiyal(1).jpg",
    "Thumbnails/Kashmir Main Tu Kanyakumari - Slowed - Reverb - ♬(1).jpg",
    "Thumbnails/Kaun Tujhe -Slowed-Reverb- Palak Muchhal Sloverb lyrics.jpg",
    "Thumbnails/Khairiyat -Slowed - Reverb- Arijit Singh Chhichhore SR Lofi.jpg",
    "Thumbnails/Khamoshiyan - Arijit Singh -Slowed-Reverb-Lofi- Song Indian Lofi.jpg",
    "Thumbnails/Lat Lag Gayi - Benny Dayal Race-2 -Slowed-Reverb-(1).jpg",
    "Thumbnails/Main Agar -Slowed Reverb- - Atif Aslam Tubelight Lo-Fi Mind .jpg",
    "Thumbnails/Main Dhoondne Ko Zamaane Mein Jab Wafa Nikla- Slowed and Reverbed -Magical- Arijit Singh.jpg",
    "Thumbnails/Main Jitna Tumhe Dekhu LoFi Remix Song Slowed Reverb Indian Lofi 76 (1).jpg",
    "Thumbnails/Darmiyaan - slowed and reverb - Nexus Music.jpg",
    "Thumbnails/Hamdard Slowed and Reverb -super- Ek Villain Arijit Singh Mithoon.jpg",
    "Thumbnails/Jab Tak -Slowed - Reverb- Armaan Malik M.S. Dhoni The Untold Story SR Lofi.jpg",
    "Thumbnails/Jeena Jeena - - Slowed - Reverb - Ear Candy .jpg",
    "Thumbnails/Labon Ko -Slowed - Reverbed- KK.jpg",
    "Thumbnails/Mann Mera -Slowed - Reverb- Bollywood hindi lofi song.jpg",
    "Thumbnails/Pehli Dafa - Atif Aslam Slowed - Reverb Lyrics Use Headphones 🎧🎧.jpg",
    "Thumbnails/Rafta Rafta - -Slowed - Reverb- - Lofi Mix - Atif Aslam - Sajal Ali LoFi Vibez.jpg",
    "Thumbnails/Sanam Re Lofi -Lyrics- - Arijit Singh(1).jpg",
    "Thumbnails/Soch Na Sake - Arjit Singh -Slowed and Reverbed-(1).jpg",
    "Thumbnails/Tera Chehra -Slowed-Reverb- Arijit Singh Sanam Teri Kasam Lofi Music Channel(1).jpg",
    "Thumbnails/Teri Meri Kahaani - - Slowed - Reverb - Arijit Singh Palak muchhal Chirantan Bhatt Lofi mix.jpg",
    "Thumbnails/Thoda thoda pyaar -slowed-reverb-(1).jpg",
    "Thumbnails/Tum Mile -Slowed-Reverb- - Javed Ali.jpg",
    "Thumbnails/Tune Jo Na Kaha -slowed - reverbed-.jpg",
    "Thumbnails/Woh Lamhe Woh Baatein - slowed and reverb - - Atif Aslam Nexus Music.jpg",
    "Thumbnails/MTV Unplugged - Bulleya Full Song Audio Sultan Papon Vishal and Shekhar Irshad Kamil.jpg"
]

# Iterate over the image names and rename them
for image_name in image_names:
    # Construct the full path of the original and new file names
    original_file_path = os.path.join(folder_path, image_name.split('/')[-1])
    if os.path.exists(original_file_path):
        new_file_name = original_file_path.replace('.jpg', '_thumbnail.jpg')
        os.rename(original_file_path, new_file_name)
        print(f'Renamed: {original_file_path} -> {new_file_name}')
    else:
        print(f'File not found: {original_file_path}')
