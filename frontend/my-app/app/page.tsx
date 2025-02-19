"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { toast } from "react-hot-toast";
import { Dancing_Script, Montserrat } from "next/font/google";
import axios from "axios"
import dotenv from "dotenv"
import secureLocalStorage from "react-secure-storage";

dotenv.config()
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
});

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student");

  const router = useRouter();


  const handleLogin = async (e: any) => {
    e.preventDefault();
    console.log(email, password, role)
    if (!email || !password) {
      toast.error("Enter email and password")
      return;
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/login`, {
      email,
      password,
      role
    });

    if (response.status === 200) {
      secureLocalStorage.setItem("token", response.data.token)
      toast.success("Login successful")
      router.push(`/${response.data.user.role}`);
    } else {
      toast.error("Login Unsuccessful")
    }

  };

  return (
    <div className="flex flex-col justify-center items-center bg-[#FAF3E0] h-screen w-full">
      <h1 className={`absolute text-[#B8860B] top-5 left-5 text-5xl ${dancingScript.className}`}>
        EdTech
      </h1>
      <div className="absolute left-50vh top-1/2 transform -translate-y-1/2 rounded-3xl w-full md:w-[500px] bg-[#FCFCFC] shadow-lg">
        <h1 className={`text-2xl ${montserrat.className} font text-center pt-4 pb-4`}>
          Sign In
        </h1>
        <hr />
        <form
          className="flex flex-col gap-4 p-8"
          onSubmit={handleLogin}
        >
          <input
            type="name"
            placeholder="Email"
            className={`border border-gray-200 py-2 px-4 rounded-lg ${montserrat.className}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`border border-gray-200 py-2 px-4 rounded-lg w-full ${montserrat.className}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
            </span>
          </div>
          <FormControl>
            <FormLabel id="role">Role</FormLabel>
            <RadioGroup
              defaultValue="student"
              name="radio-buttons-group"
              onChange={(e) => setRole((e.target.value))}
            >
              <FormControlLabel value="student" control={<Radio />} label="Student" />
              <FormControlLabel value="agent" control={<Radio />} label="Agent" />
              <FormControlLabel value="admin" control={<Radio />} label="Admin" />
            </RadioGroup>
          </FormControl>

          <p>Don't have an Account? <a href="/signin" className={`text-[#B8860B] ${dancingScript.className} ml-3 text-4xl `}>Sign Up</a></p>

          <button
            type="submit"
            disabled={!email || !password}
            className={`w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer mt-8 ${montserrat.className}`}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}