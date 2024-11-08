/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../deprecateded/auth";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Stack,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
  FormControl,
  Button,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  skills: string;
};

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("Applicant");
  const [affiliation, setAffiliation] = useState("nc-state-dining");
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      skills: "",
    },
  });

  const { register, handleSubmit, formState, watch } = form;
  const { errors } = formState;

  const onSubmit = async (data: FormValues) => {
    console.log("form submitted");
    console.log(data);
    setLoading(true);
    await signup(
      data.email,
      data.password,
      data.confirmPassword,
      data.name,
      role,
      role === "Manager" ? affiliation : affiliation,
      data.skills,
      navigate
    );
    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const { credential } = credentialResponse;
      if (credential) {
        // Ensure the audience matches

        // Send the credential (ID token) to the backend
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/google-login`,
          {
            // Replace with your backend URL
            token: credential,
          }
        );

        if (res.data.success) {
          // Store the JWT token (consider using HttpOnly cookies for better security)
          localStorage.setItem("token", res.data.data.token);
          // Redirect or perform other actions
          navigate("/dashboard"); // Replace with your desired route
        } else {
          // Handle login failure
          alert(res.data.message);
        }
      }
    } catch (error: any) {
      console.error("Google Login Error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(`Google Login Failed: ${error.response.data.message}`);
      } else {
        alert("Google Login Failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Login Failure
  const handleGoogleFailure = (error: any) => {
    console.error("Google Login Failed:", error);
    alert("Google Login Failed");
  };

  return (
    <>
      <div className="bg-slate-50 flex flex-col justify-center items-center min-h-screen px-4">
        <div className="w-full max-w-md p-6 border rounded-lg bg-white">
          <div className="text-xl text-black mb-4 text-center">
            Create New Account
          </div>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2}>
              <TextField
                label="Name"
                type="text"
                {...register("name", {
                  required: "Name is required",
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
                sx={{
                  "& label": { paddingLeft: (theme) => theme.spacing(1) },
                  "& input": { paddingLeft: (theme) => theme.spacing(2.5) },
                  "& fieldset": {
                    paddingLeft: (theme) => theme.spacing(1.5),
                    borderRadius: "10px",
                  },
                }}
              />

              <TextField
                label="Email Id"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Enter a valid email",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                sx={{
                  "& label": { paddingLeft: (theme) => theme.spacing(1) },
                  "& input": { paddingLeft: (theme) => theme.spacing(2.5) },
                  "& fieldset": {
                    paddingLeft: (theme) => theme.spacing(1.5),
                    borderRadius: "10px",
                  },
                }}
              />
              <TextField
                label="Password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
                sx={{
                  "& label": {
                    paddingLeft: (theme) => theme.spacing(1),
                  },
                  "& input": { paddingLeft: (theme) => theme.spacing(2.5) },
                  "& fieldset": {
                    paddingLeft: (theme) => theme.spacing(1.5),
                    borderRadius: "10px",
                  },
                }}
              />
              <TextField
                label="Confirm password"
                type="password"
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  validate: (val: string) => {
                    if (watch("password") !== val) {
                      return "Passwords don't match";
                    }
                  },
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                fullWidth
                sx={{
                  "& label": {
                    paddingLeft: (theme) => theme.spacing(1),
                  },
                  "& input": { paddingLeft: (theme) => theme.spacing(2.5) },
                  "& fieldset": {
                    paddingLeft: (theme) => theme.spacing(1.5),
                    borderRadius: "10px",
                  },
                }}
              />
              <TextField
                label="Skills"
                type="text"
                {...register("skills", {
                  required: "Skills are required",
                })}
                error={!!errors.skills}
                helperText={errors.skills?.message}
                fullWidth
                sx={{
                  "& label": {
                    paddingLeft: (theme) => theme.spacing(1),
                  },
                  "& input": { paddingLeft: (theme) => theme.spacing(2.5) },
                  "& fieldset": {
                    paddingLeft: (theme) => theme.spacing(1.5),
                    borderRadius: "10px",
                  },
                }}
              />
              <FormControl fullWidth>
                <InputLabel id="role-id">Role</InputLabel>
                <Select
                  value={role}
                  labelId="role-id"
                  label="Role"
                  id="role"
                  onChange={(e: SelectChangeEvent) => {
                    setRole(e.target.value);
                  }}
                >
                  <MenuItem value={"Manager"}>Manager</MenuItem>
                  <MenuItem value={"Applicant"}>Applicant</MenuItem>
                </Select>
              </FormControl>
              {role === "Manager" && (
                <FormControl fullWidth>
                  <InputLabel id="affiliation-id">Affiliation</InputLabel>
                  <Select
                    value={affiliation}
                    labelId="affiliation-id"
                    label="Affiliation"
                    id="affiliation"
                    onChange={(e: SelectChangeEvent) => {
                      setAffiliation(e.target.value);
                    }}
                  >
                    <MenuItem value={"nc-state-dining"}>
                      NC State Dining
                    </MenuItem>
                    <MenuItem value={"campus-enterprises"}>
                      Campus Enterprises
                    </MenuItem>
                    <MenuItem value={"wolfpack-outfitters"}>
                      Wolfpack Outfitters
                    </MenuItem>
                  </Select>
                </FormControl>
              )}

              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="error"
                  fullWidth
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    fontSize: "16px",
                    height: "48px",
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </motion.div>
            </Stack>
          </form>
          <div className="flex justify-center mb-4 mt-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => handleGoogleFailure}
              useOneTap
            />
          </div>
          <div className="mt-6 border-t relative">
            <span className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 bg-white px-3 text-gray-500">
              OR
            </span>
          </div>

          <p className="text-center mt-6">
            Already have an account?
            <Link className="text-red-600 ml-1" to={"/login"}>
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegistrationPage;
