import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios, { AxiosError } from "axios";
import { useMutation } from "react-query";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const authToken = localStorage.getItem("authorization_token");
  const headers: any = {};
  if (authToken) headers.Authorization = `Basic ${authToken}`;

  const { mutateAsync: preSignFileImportUrl } = useMutation<
    string,
    AxiosError,
    { url: string; fileName: string }
  >(async ({ url, fileName }: { url: string; fileName: string }) => {
    return axios
      .get(url, {
        params: { name: fileName },
        headers,
      })
      .then((res) => res.data)
      .catch((error) => {
        if (error.response?.status === 401) {
          window.dispatchEvent(
            new CustomEvent("global-toast", {
              detail: { message: "401 Unauthorized", severity: "error" },
            })
          );
        }
        if (error.response?.status === 403) {
          window.dispatchEvent(
            new CustomEvent("global-toast", {
              detail: { message: "403 Forbidden", severity: "error" },
            })
          );
        }
      });
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);

    try {
      // Get the presigned URL
      const preSignedUrl = await preSignFileImportUrl({
        url,
        fileName: encodeURIComponent(file?.name || ""),
      });
      console.log("File to upload: ", file?.name);
      console.log("Uploading to: ", preSignedUrl);
      const result = await fetch(preSignedUrl, {
        method: "PUT",
        body: file,
      });
      console.log("Result: ", result);
      setFile(undefined);
    } catch (error) {
      console.error("There was an error uploading the file", error);
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
