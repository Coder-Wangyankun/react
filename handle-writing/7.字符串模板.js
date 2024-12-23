function render(template, data) {
  const reg = /\{\{(\w+)\}\}/;
  if (reg.test(template)) {
    let key = reg.exec(template)[1];
    template = template.replace(reg, data[key]);
    return render(template, data);
  }
  return template;
}