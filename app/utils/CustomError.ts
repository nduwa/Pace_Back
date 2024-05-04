class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, code: number = 400) {
    super(message);
    this.name = "CustomError";
    this.statusCode = code;
  }
}

type IError = {
  item: string;
  error: any;
};

export const catchSequelizeError = ({ item, error }: IError): void => {
  if (error.name === "SequelizeUniqueConstraintError") {
    throw new CustomError(
      `${item} ${error.errors[0].path} already exists`,
      400
    );
  } else {
    console.log(error);
    throw new CustomError("Something went wrong", 500);
  }
};

export default CustomError;
