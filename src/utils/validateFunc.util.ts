export const isValidEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const validateEmail = (email: string, setEmailError: any) => {
  if (email === "") {
      setEmailError("");
  }
  else if (isValidEmail(email)) {
      setEmailError("");
  }
  else {
      setEmailError("Vui lòng nhập đúng định dạng Email!");
  }
}

export const validatePassword = (password: string, setPasswordError: any) => {
  if (password.trim().length < 6) {
      setPasswordError("Độ dài mật khẩu ít nhất bằng 6 kí tự!");
  } else {
      setPasswordError("");
  }
}