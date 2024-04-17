class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, code: number = 400) {
    super(message);
    this.name = "CustomError";
    this.statusCode = code;
  }
}

type IError = {
  drugStock: string;
  error: any;
};

export const catchSequelizeError = ({ drugStock, error }: IError): void => {
  if (error.name === "SequelizeUniqueConstraintError") {
    throw new CustomError(
      `${drugStock} ${error.errors[0].path} already exists`,
      400
    );
  } else {
    console.log(error);
    throw new CustomError("Something went wrong", 500);
  }
};

export default CustomError;
