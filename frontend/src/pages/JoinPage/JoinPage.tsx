import React, { useEffect } from "react";
import { joinGroup } from "../../apis/home";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAppSelector } from "../../constants/types";

function JoinPage() {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const isLogin = useAppSelector((state) => state.auth.isLogin);

  useEffect(() => {
    if (inviteCode) {
      joinGroup(inviteCode)
        .then((res) => {
          if (res.statusCode === 200) {
            toast.success("가입을 완료했습니다.");
            navigate("/home");
          } else {
            toast.error(res.message);
            navigate("/home");
          }
        })
        .catch(() => {
          toast.error("로그인을 해주세요.");
          navigate("/login");
        });
    }
  });

  return (
    <div>
      <Toaster />
    </div>
  );
}

export default JoinPage;
