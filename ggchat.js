const sentMessageGoogleChat = async (message) => {
  const url =
    "https://chat.googleapis.com/v1/spaces/AAAAicrbAoU/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=f5iQIb5gZP53q5-n8m1hoS0lGg3GpBrb6f2srYZBNRQ";
  const data = {
    text: message,
  };
  const response = await axios.post(url, data);
  return response.data;
};

module.exports = { sentMessageGoogleChat };
