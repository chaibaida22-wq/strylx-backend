import nodemailer from "nodemailer";

// =====================================================
// TRANSPORTER SMTP GMAIL
// =====================================================

const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 587,

    secure: false,

    requireTLS: true,

    auth: {

        user: process.env.SMTP_USER,

        pass: process.env.SMTP_PASSWORD

    },

    tls: {

        rejectUnauthorized: false

    }

});


// =====================================================
// VÉRIFIER CONNEXION SMTP
// =====================================================

const verifyConnection = async () => {

    try {

        await transporter.verify();

        console.log(
            "================================="
        );

        console.log(
            "✅ SMTP GMAIL CONNECTÉ"
        );

        console.log(
            "================================="
        );

    }

    catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "❌ SMTP ERROR"
        );

        console.error(
            "Code :",
            error.code
        );

        console.error(
            "Message :",
            error.message
        );

        console.error(
            "================================="
        );

    }

};


// =====================================================
// EMAIL DE VÉRIFICATION
// =====================================================

const sendVerificationEmail = async ({

    email,

    firstname,

    verificationUrl

}) => {

    const mailOptions = {

        from:
            process.env.EMAIL_FROM ||
            `"STRYL'X" <${process.env.SMTP_USER}>`,

        to: email,

        subject:
            "Vérifie ton adresse email - STRYL'X",

        html: `

        <!DOCTYPE html>

        <html>

        <head>

            <meta charset="UTF-8">

            <meta name="viewport"
                content="width=device-width, initial-scale=1.0">

            <title>
                Vérification email - STRYL'X
            </title>

        </head>

        <body style="
            margin:0;
            padding:0;
            background:#f5f5f7;
            font-family:Arial, sans-serif;
        ">

            <div style="
                max-width:600px;
                margin:40px auto;
                background:#ffffff;
                border-radius:20px;
                padding:40px;
                box-sizing:border-box;
            ">

                <!-- LOGO -->

                <h1 style="
                    text-align:center;
                    margin:0 0 30px;
                    font-size:32px;
                    font-weight:800;
                    background:linear-gradient(
                        90deg,
                        #ff6b1a,
                        #ff2e4c,
                        #8b3dff
                    );
                    -webkit-background-clip:text;
                    -webkit-text-fill-color:transparent;
                ">

                    STRYL'X

                </h1>


                <!-- TITRE -->

                <h2 style="
                    color:#222;
                    margin-bottom:20px;
                ">

                    Bonjour ${firstname || ""} 👋

                </h2>


                <!-- MESSAGE -->

                <p style="
                    color:#555;
                    font-size:16px;
                    line-height:1.7;
                ">

                    Merci d'avoir créé ton compte
                    STRYL'X.

                </p>


                <p style="
                    color:#555;
                    font-size:16px;
                    line-height:1.7;
                ">

                    Pour terminer ton inscription,
                    confirme ton adresse email en
                    cliquant sur le bouton ci-dessous.

                </p>


                <!-- BUTTON -->

                <div style="
                    text-align:center;
                    margin:35px 0;
                ">

                    <a
                        href="${verificationUrl}"
                        style="
                            display:inline-block;
                            padding:15px 30px;
                            color:#ffffff;
                            background:linear-gradient(
                                90deg,
                                #ff6b1a,
                                #ff2e4c,
                                #8b3dff
                            );
                            text-decoration:none;
                            border-radius:12px;
                            font-weight:bold;
                            font-size:16px;
                        "
                    >

                        Vérifier mon adresse email

                    </a>

                </div>


                <!-- LINK -->

                <p style="
                    color:#888;
                    font-size:13px;
                    line-height:1.6;
                ">

                    Si le bouton ne fonctionne pas,
                    copie et colle ce lien dans ton
                    navigateur :

                </p>


                <p style="
                    color:#666;
                    font-size:12px;
                    word-break:break-all;
                ">

                    ${verificationUrl}

                </p>


                <!-- EXPIRATION -->

                <p style="
                    margin-top:30px;
                    color:#999;
                    font-size:13px;
                ">

                    Ce lien de vérification est valable
                    pendant 24 heures.

                </p>


                <hr style="
                    border:none;
                    border-top:1px solid #eee;
                    margin:30px 0;
                ">


                <p style="
                    text-align:center;
                    color:#aaa;
                    font-size:12px;
                ">

                    © ${new Date().getFullYear()} STRYL'X.
                    Tous droits réservés.

                </p>

            </div>

        </body>

        </html>

        `

    };


    return transporter.sendMail(
        mailOptions
    );

};


// =====================================================
// EMAIL RESET PASSWORD
// =====================================================

const sendPasswordResetEmail = async ({

    email,

    firstname,

    resetUrl

}) => {

    const mailOptions = {

        from:
            process.env.EMAIL_FROM ||
            `"STRYL'X" <${process.env.SMTP_USER}>`,

        to: email,

        subject:
            "Réinitialisation de ton mot de passe - STRYL'X",

        html: `

        <div style="
            font-family:Arial,sans-serif;
            max-width:600px;
            margin:40px auto;
            padding:40px;
            background:#ffffff;
            border-radius:16px;
        ">

            <h1 style="
                text-align:center;
                color:#ff2e4c;
            ">

                STRYL'X

            </h1>


            <h2>

                Bonjour ${firstname || ""} 👋

            </h2>


            <p>

                Nous avons reçu une demande
                de réinitialisation de ton mot
                de passe STRYL'X.

            </p>


            <p>

                Clique sur le bouton ci-dessous
                pour créer un nouveau mot de passe.

            </p>


            <div style="
                text-align:center;
                margin:30px 0;
            ">

                <a
                    href="${resetUrl}"
                    style="
                        display:inline-block;
                        padding:14px 25px;
                        color:white;
                        background:linear-gradient(
                            90deg,
                            #ff6b1a,
                            #ff2e4c,
                            #8b3dff
                        );
                        text-decoration:none;
                        border-radius:10px;
                        font-weight:bold;
                    "
                >

                    Réinitialiser mon mot de passe

                </a>

            </div>


            <p style="
                color:#777;
                font-size:13px;
            ">

                Ce lien est valable pendant 15 minutes.

            </p>

        </div>

        `

    };


    return transporter.sendMail(
        mailOptions
    );

};


// =====================================================
// EXPORT
// =====================================================

export default {

    transporter,

    verifyConnection,

    sendVerificationEmail,

    sendPasswordResetEmail

};