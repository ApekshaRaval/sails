// ** MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import {
  Badge,
  Button,
  CardActions,
  CardMedia,
  Chip,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Pagination,
  PaginationItem,
  Select,
  TextField,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/system";
import AddBlog from "src/@core/components/dialogs/AddBlog";
import { useEffect, useState } from "react";
import LongDescription from "src/@core/components/common/LongDescription";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import { useDebounce } from "use-debounce";
import { BlogTypes } from "src/constants/Constant";

const Home = () => {
  const isMd = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [filterBy, setFilterBy] = useState([]);
  const [autoFocus, setAutoFocus] = useState(false)
  const [editData, setEditData] = useState({ isEdit: false, id: null });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [searchedValue] = useDebounce(search, 1000);
  const pageLimit = 6;
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 200,
      },
    },
  };

  const fetchData = async () => {
    const FilterData = JSON.stringify(filterBy)
    const url = `http://localhost:1337/blogs?page=${page}&limit=${pageLimit}${searchedValue && `&search=${searchedValue}`}${filterBy?.length > 0 ? `&filterBy=${FilterData}` : ""}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data?.status === 200) {
        setData(data?.data);
        setTotal(data?.total);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      const response = await fetch(`http://localhost:1337/blog/${id}`, {
        method: "DELETE",
      });
      if (response?.status === 200) {
        fetchData();
        toast.success("Blog deleted successFully", { duration: 2000 });
      }
    } catch (error) {
      toast.error("Unable to delete blog", { duration: 2000 });
      console.log("error", error);
    }
  };

  const handleUpdateBlog = (id) => {
    setEditData({ isEdit: true, id: id });
    setOpen(true);
  };

  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchData();
  }, [open, page, searchedValue, filterBy]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setFilterBy(typeof value === "string" ? value.split(",") : value);
  };

  const SearchAndFilter = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: isMd ? "row" : "column",
          gap: 4,
          justifyContent: isMd ? "space-between" : "flex-start",
          alignItems: isMd ? "center" : "flex-start",
        }}
      >
        <Box sx={{ paddingX: '20px' }}>
          <TextField
            sx={{ width: "100%" }}
            id="input-with-icon-textfield"
            placeholder="Search Blogs...."
            value={search}
            autoFocus={autoFocus}
            onChange={(e) => { setSearch(e.target.value), setAutoFocus(true) }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
        </Box>
        <Box sx={{ mb: 3, paddingX: '20px' }}>
          <InputLabel shrink sx={{ fontSize: "17px", fontWeight: 700 }}>
            Filter by blog Type
          </InputLabel>
          <Select
            multiple
            placeholder="Filter by blogType"
            fullWidth
            sx={{ width: "200px" }}
            value={filterBy}
            onChange={handleChange}
            input={
              <OutlinedInput id="select-multiple-chip" placeholder="filter" />
            }
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {BlogTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    );
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <CardHeader title="Here is Your Blogs 🚀"> </CardHeader>
            <Button
              onClick={() => setOpen(!open)}
              variant="text"
              color="primary"
              sx={{
                float: "right",
                borderRadius: "50%",
                mr: 3,
                ":hover": { backgroundColor: "transparent" },
              }}
            >
              {" "}
              <AddIcon />
            </Button>
          </Box>
          <SearchAndFilter />
          <CardContent>
            <Grid
              container
              spacing={2}
              sx={{
                display: "flex",
                justifyContent: isMd ? "flex-start" : "center",
              }}
            >
              {data?.length > 0 ? (
                data?.map((item, index) => {
                  return (
                    <Grid item xs={12} sm={6} md={4} xl={3}>
                      <Card
                        sx={{
                          maxWidth: isMd ? 345 : "100%",
                          mb: 2,
                          minHeight: showFullDescription ? 300 : 455,
                          height: "100%",
                          position: "relative",
                          "& .css-16tygbx-MuiCardActions-root": {
                            padding: "0px",
                          },
                        }}
                        key={index}
                      >
                        <CardMedia
                          sx={{ height: 250 }}
                          image="https://www.shutterstock.com/image-vector/editable-online-document-concept-creative-600nw-1980137399.jpg"
                          title="green iguana"
                        />
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "center",
                              mb: 2,
                              textTransform: "capitalize",
                            }}
                          >
                            {" "}
                            <Chip
                              label={item?.blogtype}
                              sx={{
                                backgroundColor: "#b796e9",
                                color: "white",
                              }}
                            />
                          </Box>
                          <Typography
                            gutterBottom
                            component="div"
                            sx={{ fontSize: "15px", fontWeight: 700 }}
                          >
                            {item?.title}
                          </Typography>
                          <LongDescription
                            description={item?.description}
                            fontSize={"14px"}
                            setShowFullDescription={setShowFullDescription}
                            showFullDescription={showFullDescription}
                          />
                        </CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <CardActions
                            sx={{
                              position: "absolute",
                              top: "0px",
                              right: "0px",
                              padding: "1rem",
                            }}
                          >
                            <Button
                              fullWidth
                              variant="contained"
                              sx={{
                                width: "20px",
                                backgroundColor: "rgba(255, 255, 255, 0.4)",
                                color: "black",
                                backdropFilter: "blur(5px)",
                                ":hover": {
                                  backgroundColor: "rgba(100, 100, 255, 0.4)",
                                },
                              }}
                              onClick={() => handleUpdateBlog(item?.id)}
                            >
                              <ModeEditIcon />
                            </Button>
                            <Button
                              fullWidth
                              variant="contained"
                              sx={{
                                width: "20px",
                                backgroundColor: "rgba(255, 255, 255, 0.4)",
                                color: "red",
                                backdropFilter: "blur(5px)",
                                ":hover": {
                                  backgroundColor: "rgba(100, 100, 255, 0.4)",
                                },
                              }}
                              onClick={() => handleDeleteBlog(item?.id)}
                            >
                              <DeleteIcon />
                            </Button>
                          </CardActions>
                        </Box>
                      </Card>
                    </Grid>
                  );
                })
              ) : (
                <Box sx={{ mx: "auto" }}>
                  <CardMedia
                    sx={{ height: 300, width: 300 }}
                    image="https://www.shutterstock.com/image-vector/copywriting-writing-icon-creative-storytelling-600nw-1984450361.jpg"
                    title="green iguana"
                  />
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{ textAlign: "center", fontWeight: 700 }}
                  >
                    No Blogs Found 🥺
                  </Typography>
                </Box>
              )}
            </Grid>
            {data?.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 5,
                }}
              >
                <Pagination
                  sx={{
                    "& .css-iyzz3i-MuiButtonBase-root-MuiPaginationItem-root:not(.MuiPaginationItem-outlined):not(.Mui-disabled).Mui-selected": {
                      boxShadow: "none !important",
                    },
                    "& .css-iyzz3i-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected": {
                      backgroundColor: "#8f8ff1 !important",
                      color: "white",
                    },
                  }}
                  count={Math.ceil(total / pageLimit)}
                  page={page}
                  onChange={handlePageChange}
                  renderItem={(item) => (
                    <PaginationItem
                      slots={{
                        previous: ArrowBackIcon,
                        next: ArrowForwardIcon,
                      }}
                      {...item}
                    />
                  )}
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
      {open && (
        <AddBlog
          open={open}
          setOpen={setOpen}
          editData={editData}
          setEditData={setEditData}
        />
      )}
    </Grid>
  );
};

export default Home;
