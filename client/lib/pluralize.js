const pluralize = (count, singular, plural = undefined) => {
  const noun = count === 1 ? singular : plural ?? `${singular}s`;

  return `${count} ${noun}`;
};

export default pluralize;
