/**
 * TodoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { HTTP_STATUS_CODE } = sails.config.constants;
module.exports = {
    addBlog: async (req, res) => {
        try {
            const { id, title, description, blogType } = req.body;

            if (!id || !title || !description || !blogType) {
                return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
                    status: HTTP_STATUS_CODE.NOT_FOUND,
                    errorCode: "ERR404",
                    message: "Missing required fields",
                    data: null,
                    error: "",
                });
            }

            // Check for unique title using parameterized query
            const uniqueTitleQuery = `SELECT * FROM blog WHERE title = $1`;
            const uniqueTitle = await sails.sendNativeQuery(uniqueTitleQuery, [title]);

            if (uniqueTitle.rowCount > 0) {
                return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
                    status: HTTP_STATUS_CODE.BAD_REQUEST,
                    errorCode: "ERR400",
                    message: "Title value must be unique, please enter a unique title",
                    data: null,
                    error: "",
                });
            }

            // Insert new blog using parameterized query
            const addBlogQuery = `INSERT INTO blog (id, title, description, blogtype) VALUES ($1, $2, $3, $4)`;
            const data = await sails.sendNativeQuery(addBlogQuery, [id, title, description, blogType]);

            return res.status(HTTP_STATUS_CODE.OK).json({
                status: HTTP_STATUS_CODE.OK,
                errorCode: "SUC000",
                message: "Blog Created Successfully",
                data: data,
                error: "",
            });

        } catch (err) {
            console.log(err);
            return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
                status: HTTP_STATUS_CODE.SERVER_ERROR,
                errorCode: "ERR500",
                message: "Internal Server Error!",
                data: null,
                error: err,
            });
        }
    },


    getBlogs: async (req, res) => {
        try {
            const { page, limit, search, filterBy } = req.query;
            console.log('filterBy: ', filterBy);
            const offset = Number(limit) * Number(page) - Number(limit);
            const params = filterBy?.length > 0 && filterBy.map((_, index) => `$${index + 1}`).join(", ");
            const getAllCountClause = `SELECT COUNT(*) FROM blog`;
            const getAllFilterCountClause = `SELECT COUNT(*) FROM blog where blogtype IN (${params})`;
            console.log('getAllFilterCountClause: ', getAllFilterCountClause);
            const getAllBlogssssQuery = await sails.sendNativeQuery(
                getAllFilterCountClause
            );
            console.log('getAllBlogssssQuery: ', getAllBlogssssQuery);
            const getAllSearchListCount = `SELECT COUNT(*) FROM blog where title ILIKE '%${search}%'`;
            const getAllSearchDataClause = `SELECT * FROM  blog where title ILIKE '%${search}%' LIMIT ${limit} OFFSET ${offset} `;
            const getAllDataWithoutSearchClause = `SELECT * FROM  blog LIMIT ${limit} OFFSET ${offset} `;

            const getAllBlogsTotalQuery = search
                ? getAllSearchListCount
                : getAllCountClause;
            const blogDataTotalCount = await sails.sendNativeQuery(
                getAllBlogsTotalQuery
            );
            const getAllBlogsQuery = search
                ? getAllSearchDataClause
                : getAllDataWithoutSearchClause;
            const blogData = await sails.sendNativeQuery(getAllBlogsQuery);

            return res.status(HTTP_STATUS_CODE.OK).json({
                status: HTTP_STATUS_CODE.OK,
                errorCode: "SUC000",
                message: "",
                data: blogData?.rows,
                error: "",
                total: Number(blogDataTotalCount?.rows[0]?.count),
            });
        } catch (err) {
            console.log(err);
            return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
                status: HTTP_STATUS_CODE.SERVER_ERROR,
                errorCode: "ERR500",
                message: "Internal Server Error!",
                data: null,
                error: err,
            });
        }
    },

    updateBlog: async (req, res) => {
        const { id } = req.params;
        console.log('id: ', id);
        const { title, description, blogType } = req.body;
        try {
            if (!id) {
                return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
                    status: HTTP_STATUS_CODE.NOT_FOUND,
                    errorCode: "ERR404",
                    message: "Not Found Data, id is required",
                    data: null,
                    error: "",
                });
            }
            const idIsAlreadyExistClause = `SELECT * FROM blog WHERE id = $1`
            const idPresentData = await sails.sendNativeQuery(idIsAlreadyExistClause, [id]);
            console.log('idPresentData: ', idPresentData);
            if (idPresentData?.rows <= 0) {
                return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
                    status: HTTP_STATUS_CODE.BAD_REQUEST,
                    errorCode: "ERR400",
                    message: "Blog data not found!",
                    data: null,
                    error: "",
                });
            }

            if (!title || !description || !blogType) {
                return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
                    status: HTTP_STATUS_CODE.NOT_FOUND,
                    errorCode: "ERR404",
                    message: "Missing required fields",
                    data: null,
                    error: "",
                });
            }

            const updateQuery = `UPDATE blog SET title = $1, description = $2, blogtype = $3 WHERE id = $4`;
            const updatedQueryData = await sails.sendNativeQuery(updateQuery, [title, description, blogType, id]);
            console.log('updatedQueryData: ', updatedQueryData);

            return res.status(HTTP_STATUS_CODE.OK).json({
                status: HTTP_STATUS_CODE.OK,
                errorCode: "SUC000",
                message: "Blog updated SuccessFully",
                data: updatedQueryData,
                error: "",
            });

        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
                status: HTTP_STATUS_CODE.SERVER_ERROR,
                errorCode: "ERR500",
                message: "Internal Server Error!",
                data: {},
                error: error,
            });
        }
    },

    deleteBlog: async (req, res) => {
        const { id } = req.params;
        try {
            if (!id) {
                return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
                    status: HTTP_STATUS_CODE.NOT_FOUND,
                    errorCode: "ERR404",
                    message: "Not Found Data, id is required",
                    data: null,
                    error: "",
                });
            }

            const idIsAlreadyExistClause = `SELECT * FROM blog WHERE id = $1`
            const idPresentData = await sails.sendNativeQuery(idIsAlreadyExistClause, [id]);
            if (idPresentData?.rows <= 0) {
                return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
                    status: HTTP_STATUS_CODE.BAD_REQUEST,
                    errorCode: "ERR400",
                    message: "Blog data not found!",
                    data: null,
                    error: "",
                });

            } else {
                const deleteQuery = `DELETE FROM blog WHERE id = $1`;
                const deletedQueryData = await sails.sendNativeQuery(deleteQuery, [id]);
                return res.status(HTTP_STATUS_CODE.OK).json({
                    status: HTTP_STATUS_CODE.OK,
                    errorCode: "SUC000",
                    message: "Blog Deleted SuccessFully",
                    data: deletedQueryData,
                    error: "",
                });
            }
        } catch (err) {
            return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
                status: HTTP_STATUS_CODE.SERVER_ERROR,
                errorCode: "ERR500",
                message: "Internal Server Error!",
                data: null,
                error: err,
            });
        }
    },

    getBlogDetail: async (req, res) => {
        const { id } = req.params;
        const getDetailQuery = `SELECT * FROM blog WHERE id = $1`;
        const blogData = await sails.sendNativeQuery(getDetailQuery, [id]);
        return res.status(HTTP_STATUS_CODE.OK).json({
            status: HTTP_STATUS_CODE.OK,
            errorCode: "SUC000",
            message: "",
            data: blogData?.rows,
            error: "",
            total: blogData?.rowCount,
        });
    },
};
