// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

const errorMiddleware = (
    err,
    req,
    res,
    next
) => {

    console.error(
        "================================="
    );

    console.error(
        "GLOBAL ERROR"
    );

    console.error(
        "Message :",
        err.message
    );

    console.error(
        "Status  :",
        err.statusCode ||
        err.status ||
        500
    );

    console.error(
        "Code    :",
        err.code ||
        "NO_CODE"
    );

    console.error(
        "Stack   :",
        err.stack
    );

    console.error(
        "================================="
    );


    // =================================================
    // STATUS
    // =================================================

    const statusCode =
        err.statusCode ||
        err.status ||
        500;


    // =================================================
    // MESSAGE
    // =================================================

    const message =
        err.message ||
        "Une erreur interne du serveur est survenue.";


    // =================================================
    // RESPONSE
    // =================================================

    return res
        .status(statusCode)
        .json({

            success: false,

            message,

            ...(err.code && {
                code: err.code
            })

        });

};


export default errorMiddleware;