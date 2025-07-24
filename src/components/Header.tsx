"use client";

import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from "@mui/material";
import { useEffect, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

const Header = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user")
    setIsLoggedIn(!!token);

    if(user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserRole(parsedUser.role || null);
      } catch (error){
        console.log("Failed to fetch user role",error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    document.cookie = "token=; path=/; max-age=0";

    console.log("logout success");
    setIsLoggedIn(false);
    setOpen(false);
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push('registration');
  }

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        color: "white",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#5a4322" }}
        >
          KITHAAB
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>

          {isLoggedIn ? (
            <>
            {userRole === 'seller' && (
              <Button
                variant="outlined"
                onClick={() => router.push("/books/add-book")}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  px: 3,
                  color: "#99760398",
                  borderColor: "#99760398",
                  borderRadius: 2,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  "&:hover": {
                    backgroundColor: "#a27b5c",
                    color: "#fff",
                    borderColor: "#a27b5c",
                  },
                }}
              >
                Add Book
              </Button>
            )}


              <Button
                variant="outlined"
                onClick={() => setOpen(true)}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  px: 3,
                  borderRadius: 2,
                  borderColor: "#99760398",
                  color: "#99760398",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  "&:hover": {
                    backgroundColor: "#a27b5c",
                    color: "#fff",
                    borderColor: "#a27b5c",
                  },
                }}
              >
                Logout
              </Button>

              <Button
                variant="outlined"
                onClick={() => router.push(`/user/view`)}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  px: 3,
                  borderRadius: 2,
                  borderColor: "#99760398",
                  color: "#99760398",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  "&:hover": {
                    backgroundColor: "#a27b5c",
                    color: "#fff",
                    borderColor: "#a27b5c",
                  },
                }}
              >
                Profile
              </Button>
            </>
          ) : (
            <>
            <Button
              variant="outlined"
              onClick={handleLogin}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                borderRadius: 2,
                borderColor: "#99760398",
                color: "#99760398",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                "&:hover": {
                  backgroundColor: "#a27b5c",
                  color: "#fff",
                  borderColor: "#a27b5c",
                },
              }}
            >
              Login
            </Button>

            <Button
              variant="outlined"
              onClick={handleRegister}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                borderRadius: 2,
                borderColor: "#99760398",
                color: "#99760398",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                "&:hover": {
                  backgroundColor: "#a27b5c",
                  color: "#fff",
                  borderColor: "#a27b5c",
                },
              }}
            >
              Register
            </Button>
            </>
          )}
        </Box>

        <ConfirmDialog
          open={open}
          title="Logout"
          message="Are you sure you want to logout?"
          onClose={() => setOpen(false)}
          onConfirm={handleLogout}
          confirmText="Logout"
          cancelText="Stay"
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
