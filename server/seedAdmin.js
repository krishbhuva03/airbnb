import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/user.js";

dotenv.config();

const adminData = {
    name: "admin",
    email: "admin@gmail.com",
    password: "Adm!n2003",
    isAdmin: true
};

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("✅ Connected to MongoDB");

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        
        if (existingAdmin) {
            console.log("⚠️  Admin user already exists with email:", adminData.email);
            
            // Update to ensure isAdmin is true
            if (!existingAdmin.isAdmin) {
                existingAdmin.isAdmin = true;
                await existingAdmin.save();
                console.log("✅ Updated existing user to admin status");
            } else {
                console.log("ℹ️  User is already an admin");
            }
        } else {
            // Hash the password
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(adminData.password, salt);

            // Create admin user
            const admin = new User({
                name: adminData.name,
                email: adminData.email,
                password: hashedPassword,
                isAdmin: true
            });

            await admin.save();
            console.log("✅ Admin user created successfully!");
            console.log("   Name:", adminData.name);
            console.log("   Email:", adminData.email);
        }

    } catch (error) {
        console.error("❌ Error seeding admin:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");
    }
};

seedAdmin();
