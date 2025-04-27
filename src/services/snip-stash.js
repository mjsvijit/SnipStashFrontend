import axiosInstance from "@/axios";

function handleSnipForm(data) {
  let payload = {};
  payload.data = data;
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/snip-stashes`,
        payload
      );
      resolve(response);
    } catch (error) {
      reject({ message: error });
    }
  });
}

export {
  handleSnipForm
};
