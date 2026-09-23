import express from "express";
import client from './client.js'

const app = express();

app.use(express.json());

// Fake OTP storage for now.
// Your task is to replace this logic with Redis.
const otpStore = new Map();

// Generate a random 6-digit OTP
function generateOTP() {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
}

// Send OTP
app.post("/auth/send-otp", async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({
            message: "Phone number is required",
        });
    }

    const otp = generateOTP();

    // Temporary storage.
    // Replace this with Redis.
    // otpStore.set(phone, otp);

    await client.set(`otp:${phone}`, otp, "EX", 120);

    console.log(`OTP for ${phone}: ${otp}`);

    res.status(200).json({
        message: "OTP sent successfully",
    });
});

// Verify OTP
app.post("/auth/verify-otp", async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({
            message: "Phone and OTP are required",
        });
    }

    // Get OTP from temporary storage.
    // Replace this with Redis GET.

    const otpStored = await client.get(`otp:${phone}`)

    if (!otpStored) {
        return res.status(400).json({
            success: false,
            message: "OTP expired"
        })
    }

    console.log(typeof otp, " ", typeof otpStored);

    if (otpStored !== otp) {

        return res.status(400).json({
            success: false,
            message: "wrong OTP"
        })
    }

    await client.del(`otp:${phone}`)


    res.status(200).json({
        message: "OTP verified successfully",
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});