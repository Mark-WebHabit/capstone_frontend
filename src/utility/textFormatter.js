export const formatEmailToDisplay = (email) => {
  if (!email) return;

  const textArr = email.split("");

  if (textArr.length > 25) {
    return textArr.join("").substring(0, 25) + "...";
  } else {
    return email;
  }
};
