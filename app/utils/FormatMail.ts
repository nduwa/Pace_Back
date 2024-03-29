import VARIABLES from "../config/variables";

const FormatMail = (message: string) => {
  return `
    <body style='font-family: "Google Sans",Roboto,RobotoDraft,Helvetica,Arial,sans-serif; padding: 40px 0; color: #222; font-size: 15px'>
        <center>
            <div style="width: 100%; max-width: 550px; background: #fff; padding: 30px; text-align: left; border: 1px solid #eef; border-radius: 5px">
                ${header()}
                ${message}
                ${signature()}
            </div>
        </center>
    </body>`;
};

const header = () => {
  return `
    <header style="margin-bottom: 40px">
        <center>
            <img src="${VARIABLES.LOGO_URL}" width="120" />
        <center>
    </header>
  `;
};

const signature = () => {
  return `
        <div style="margin-top: 30px">
            <p>Warm regards,</p>
            <p>${VARIABLES.APP_NAME}</p>
        </div>
    `;
};

export default FormatMail;
