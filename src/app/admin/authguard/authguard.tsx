"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

interface Profile {
  birthday: string;
  country: string;
  created_at: string;
  email: string;
  fullname: string;
  gender: string;
  last_update: string;
  phone: string;
  role: string;
  url_avatar: string;
}

const useAuthGuard = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      router.push("/");
      setShowLogin(true);
      setLoading(false);
      return;
    }

    axios
      .get("/profile", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response: any) => {
        const fetchedProfileData = response?.data;

        if (fetchedProfileData) {
          setProfileData(fetchedProfileData);

          if (fetchedProfileData.role !== "admin") {
            router.push("/");
            setShowLogin(true);
          }
        } else {
          setError("Không thể tải thông tin người dùng.");
          router.push("/");
          setShowLogin(true);
        }
      })
      .catch((error: any) => {
        console.error("Error fetching profile details", error);
        setError("Lỗi khi tải thông tin người dùng.");
        router.push("/");
        setShowLogin(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  useEffect(() => {
    if (profileData && typeof window !== "undefined") {
      localStorage.setItem("profileData", JSON.stringify(profileData));
    }
  }, [profileData]);

  if (loading) {
    return null;
  }

  return { profileData, loading, error, showLogin };
};

export default useAuthGuard;
