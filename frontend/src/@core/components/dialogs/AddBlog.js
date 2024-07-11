import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { InputLabel, MenuItem, TextField } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import "react-quill/dist/quill.snow.css";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box } from "@mui/system";
import toast from "react-hot-toast";
import { BlogTypes } from "src/constants/Constant";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function AddBlog({ open, setOpen, editData, setEditData }) {
    const [blogData, setBlogData] = React.useState({})
    const validationForm = yup.object().shape({
        blogType: yup.string().required('Blog Type is required'),
        title: yup.string().required('Title is required'),
        description: yup.string().required('Description is required'),
    });

    const { register, watch, setValue, getValues, trigger, formState: { errors } } = useForm({
        resolver: yupResolver(validationForm)
    });

    const getBlogDetail = async () => {
        const response = await fetch(`http://localhost:1337/blog/${editData?.id}`, {
            method: 'GET'
        })
        const data = await response.json()
        setBlogData(data?.data)
    }

    React.useEffect(() => {
        if (editData?.id) {
            getBlogDetail()
        }
    }, [])

    React.useEffect(() => {
        if (blogData) {
            setValue('blogType', blogData[0]?.blogtype)
            setValue('title', blogData[0]?.title)
            setValue('description', blogData[0]?.description)
        }
    }, [blogData, editData?.isEdit, open])

    const handleAddBlog = async () => {
        const isValid = await trigger();
        if (!isValid) return;
        const values = getValues();
        const payloadData = {
            id: uuidv4(),
            title: values.title,
            description: values.description,
            blogType: values.blogType,
        };
        try {
            const apiUrl = editData?.isEdit ? `http://localhost:1337/blog/${editData?.id}` : "http://localhost:1337/create-blog";
            const responseData = await fetch(apiUrl, {
                method: editData?.isEdit ? "PUT" : "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payloadData),
            });
            const data = await responseData.json();
            if (data?.status === 200) {
                const SuccessMessage = editData?.isEdit ? `Blog updated successfully` : `Blog added successfully`
                toast.success(SuccessMessage, { duration: 2000 })
                setOpen(false);
            }
        } catch (err) {
            console.error("err: ", err);
            const ErrorMessage = editData?.isEdit ? `Unable to edit blog ${err}` : `Unable to add blog ${err}`
            toast.error(ErrorMessage, { duration: 2000 })
            setOpen(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setEditData({ isEdit: false, id: null });
    };

    const quillModules = {
        toolbar: [
            [{ size: ["small", false, "large", "huge"] }], // custom dropdown
            [{ font: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
            ["link"],
            [{ align: [] }],
            [{ color: ["#382768", "#01a796", "#32325d", "#cacaca", "#80798b", "#000", "#FFF", "#e20303", "#ff9f43", "#01aed4"] }],
            ["clean"], // remove formatting button
        ],
    };
    return (
        <React.Fragment>
            <Dialog
                open={open}
                fullWidth
                scroll="paper"
                maxWidth="md"
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {editData?.isEdit ? "Edit your Blog" : "Add your Blog"}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 3 }}>
                        <InputLabel shrink sx={{ fontSize: "17px", fontWeight: 700 }}>
                            Blog Type
                        </InputLabel>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <TextField
                                id="outlined-select-currency"
                                select
                                {...register("blogType")}
                            >
                                {BlogTypes.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            {errors.blogType && <span style={{ color: "red" }}>{errors.blogType ? errors.blogType.message : ""}</span>}
                        </Box>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <InputLabel shrink sx={{ fontSize: "17px", fontWeight: 700 }}>
                            Blog Title
                        </InputLabel>
                        <TextField
                            id="outlined-basic"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register("title")}
                        />
                        {errors.title && <span style={{ color: "red" }}>{errors.title ? errors.title.message : ""}</span>}
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <InputLabel shrink sx={{ fontSize: "17px", fontWeight: 700 }}>
                            Blog Content
                        </InputLabel>
                        <ReactQuill
                            value={watch("description")}
                            onChange={(e) => setValue("description", e)}
                            modules={quillModules}
                        />
                        {errors.description && <span style={{ color: "red" }}>{errors.description.message}</span>}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleAddBlog} variant="contained">
                        {editData?.isEdit ? "Edit Blog" : "Add Blog"}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment >
    );
}
