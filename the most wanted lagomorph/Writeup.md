# the most wanted lagomorph : Solution

In this challenge, entering the provided Mandarin code into [Dcode.fr](https://www.dcode.fr) reveals the first hint: **Rot8000**.

![Rot8000](https://github.com/user-attachments/assets/9b9772a9-8a15-46fe-9106-f7fefb06b80b)

Decoding this **Rot8000** code gives us:

![Decoded Rot8000](https://github.com/user-attachments/assets/1504e5ab-9474-433f-8b89-981ca71c96c7)

Analyzing this hints at a similarity with hex codes; since ASCII code is fully numerical, it cannot be ASCII due to the presence of random alphabets alongside numerical values.

However, attempting to decode it as hex also poses an issue, as hexadecimal values only contain letters **A to F**. This suggests that the text might first require a **ROT13** or **ATBASH** transformation to shift the letters into the valid hexadecimal range.

The letters currently present are:
- **m**
-  **j**
- **k**
- **l**
- **i**

Decoding with **ATBASH** gives us:

![ATBASH Decoding](https://github.com/user-attachments/assets/427a6bf6-60d1-4fb5-8ad8-b2eb908b7477)

Which gives us the letter range as:
- **n**
- **q**
- **p**
- **o**
- **r**

This alone didn’t achieve the required task of bringing the letters into the **A-F** range. However, applying **ROT13** from this point does the trick:

![ROT13 Applied](https://github.com/user-attachments/assets/64766b73-4f95-468c-a9c8-72c8f61fd579)

Now, converting the code obtained from **Hex**, we get:

![Hex Decoding](https://github.com/user-attachments/assets/1174f150-3e81-4412-8988-775eeac57a2d)

Again, using the same tool we used to identify **Rot8000**, we use **Dcode.fr** and discover that the obtained text is **Base64**:

![Base64 Detected](https://github.com/user-attachments/assets/5945df1b-1e49-4f52-8585-b86620e8be5f)

Which thereby gives us the following text:

![Base64 Decoded](https://github.com/user-attachments/assets/76324ff4-6eea-4bd0-9bd4-08c767ceb4a6)

Now, this is where the previously used tools start failing, as the text is encoded using a less familiar cipher. This is where the challenge description comes into play: **"NO MORE BUNNY BUSINESS."**

A simple Google search leads us to this episode:

![Bunny Business](https://github.com/user-attachments/assets/e21ffee9-c109-40cf-8cb8-013897acfab0)

Which not only hints at a connection to **Rabbit**, but also introduces us to a character named **"Dennis"**.

Hence, this is **Rabbit Cipher** with the key **"dennis"**.

What hints at the password being all lowercase? The challenge title itself was written in all lowercase, subtly guiding us toward this detail.

And finally, decrypting with this key gives us:

![Final Decryption](https://github.com/user-attachments/assets/ef172e75-8b53-47f8-a936-f28f7d2a264b)

###  FLAG:
```
BITSCTF{f3rb_1_kn0w_wh47_w3_4r3_60nn4_d0_70d4y}
