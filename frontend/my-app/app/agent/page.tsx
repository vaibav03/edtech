"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import secureLocalStorage from "react-secure-storage";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Theme, useTheme } from '@mui/material/styles';
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";

interface Internship {
  name: string;
  company: string;
  position: string;
  description: string;
  questions: string[];
  tags: string[];
  salary: string;
}

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}



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
const AgentInternships = () => {
  const [internships, setInternships] = useState([]);
  const theme = useTheme();
  const [personName, setPersonName] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    position: "",
    description: "",
    interestedtags: [],
    salary: "",
    uploadedby: (() => {
      const user = secureLocalStorage.getItem("user");
      return user && typeof user === 'object' && 'email' in user ? user.email : '';
    })(),
  });

  const fetchInternships = async () => {
    try {
      let response;
      const user = secureLocalStorage.getItem("user");
      if (user && typeof user === 'object' && 'email' in user) {
        const email = user.email;
        console.log("sending request to", `${process.env.NEXT_PUBLIC_SERVER_URL}/agent?uploadedby=${email}`);
        response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/agent?uploadedby=${email}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${secureLocalStorage.getItem("token")}`
          }
        });
        setInternships((response as any).data.internships);
        console.log(response)
      }
    } catch (error) {
      toast.error("Failed to fetch internships");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleChangetag = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData)
  };

  const handleAddInternship = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}`, formData);
      toast.success("Internship added successfully!");
      fetchInternships();
    } catch (error) {
      toast.error("Failed to add internship");
      console.error(error);
    }
  };

  const handleDeleteInternship = async (name: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}`, { data: { name, uploadedby: formData.uploadedby } });
      toast.success("Internship deleted successfully!");
      fetchInternships();
    } catch (error) {
      toast.error("Failed to delete internship");
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Manage Internships</h2>

      <form onSubmit={handleAddInternship} className="mb-6 space-y-4">
        <input className="w-full p-2 border rounded" name="name" placeholder="Internship Name" onChange={handleChange} required />
        <input className="w-full p-2 border rounded" name="company" placeholder="Company" onChange={handleChange} required />
        <input className="w-full p-2 border rounded" name="position" placeholder="Position" onChange={handleChange} required />
        <textarea className="w-full p-2 border rounded" name="description" placeholder="Description" onChange={handleChange} required />

        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-chip-label">Select Interested Fields</InputLabel>
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={personName}
            name="interestedtags"
            onChange={handleChangetag || handleChange}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => {
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

        <input className="w-full p-2 border rounded" name="salary" placeholder="Salary" onChange={handleChange} required />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Add Internship</button>
      </form>

      <h3 className="text-xl font-semibold mb-4">Uploaded Internships</h3>
      {internships.length === 0 ? (
        <p>No internships found</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Company</th>
              <th className="border p-2">Position</th>
              <th className="border p-2">Salary</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {internships.map((internship: Internship) => (
              <tr key={internship.name} className="text-center">
                <td className="border p-2">{internship.name}</td>
                <td className="border p-2">{internship.company}</td>
                <td className="border p-2">{internship.position}</td>
                <td className="border p-2">{internship.salary}</td>
                <td className="border p-2">
                  <button onClick={() => handleDeleteInternship(internship.name)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};


export default AgentInternships;
function URIencoded(uploadedby: unknown) {
  throw new Error("Function not implemented.");
}

