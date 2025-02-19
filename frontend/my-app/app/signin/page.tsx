"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { toast, Toaster } from "react-hot-toast";
import { Dancing_Script, Montserrat } from "next/font/google";
import axios from "axios";
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import { Theme, useTheme } from '@mui/material/styles';
import dotenv from "dotenv";

dotenv.config()

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
});

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student");
  const [interestedTags, setInterestedTags] = useState<string[]>([]);
  const theme = useTheme();
  const [personName, setPersonName] = useState<string[]>([]);


  const router = useRouter();

  const handleSignUp = async (e: any) => {

    e.preventDefault();
    if (!email || !password || !username) {
      toast.error("Enter all required fields");
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/register`, {
        username,
        email,
        password,
        role,
        interestedtags: role === "student" ? interestedTags : []
      });
      console.log(response)
      toast.success("SignUp successful!");
      router.push(`/`);
    } catch (error) {
      return toast.error("Login failed");
    }
  };


  function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
      fontWeight: personName.includes(name)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    };
  }
  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      typeof value === 'string' ? value.split(',') : value,
    );
  };


  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 224,
        width: 250,
      },
    },
  };

  const availableTags = [
    "Web Development", "Machine Learning", "Databases", "Cybersecurity",
    "Cloud Computing", "Blockchain", "Embedded Systems", "UI/UX Design",
    "Mobile App Development", "Computer Vision"
  ];

  return (
    <div className="flex flex-col justify-center items-center bg-[#FAF3E0] h-screen w-full">
      <h1 className={`absolute text-[#B8860B] top-5 left-5 text-5xl ${dancingScript.className}`}>
        EdTech
      </h1>
      <div className="absolute top-1/2 transform -translate-y-1/2 rounded-3xl w-full md:w-[500px] bg-[#FCFCFC] shadow-lg p-6">
        <h1 className={`text-2xl ${montserrat.className} font text-center pb-4`}>Sign Up</h1>
        <hr />
        <form className="flex flex-col gap-4 p-4" onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Username"
            className="border border-gray-200 py-2 px-4 rounded-lg"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-200 py-2 px-4 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="border border-gray-200 py-2 px-4 rounded-lg w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
            </span>
            <Toaster />
          </div>
          <FormControl>
            <FormLabel>Role</FormLabel>
            <RadioGroup
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <FormControlLabel value="student" control={<Radio />} label="Student" />
              <FormControlLabel value="agent" control={<Radio />} label="Agent" />
              <FormControlLabel value="admin" control={<Radio />} label="Admin" />
            </RadioGroup>
          </FormControl>

          {role === "student" && (
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-multiple-chip-label">Select Interested Fields</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => {
                  setInterestedTags(selected);
                  console.log(interestedTags)
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  );
                }}
                MenuProps={MenuProps}
              >
                {availableTags.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, personName, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <button
            type="submit"
            disabled={!email || !password || !username}
            className="w-full text-lg rounded-lg bg-black text-white p-2 mt-4"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}