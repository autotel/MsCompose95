
touch "sounds.js";
echo "module.exports={" > sounds.js;

for f in ./*.mp3; do 
    echo "base64 \"$f\" > \"$f.b64\""; 
    base64 "$f" > "$f.b64"
    echo "  \"$f\":\`$(base64 "$f")\`," >> "sounds.js"
done

echo "}" >> "sounds.js"
