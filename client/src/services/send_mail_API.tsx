import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const sendAlertEmailAPI = async (
  subject: string,
  text: string,
  html: string
) => {
  const res = await axios.post(`${BASE_URL}/api/send-email`, {
    subject,
    text,
    html,
  });
  return res.data;
};
