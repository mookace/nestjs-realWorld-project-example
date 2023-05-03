//Slugify
const slug = require('slug');
export const slugify = (title: string) => {
  return slug(title, { lower: true }) + '-' + Date.now();
};

// (req, this.repository, condition, order)
export const Pagination = async (req, model, condition, order) => {
  req.query.page && req.query.page != 0 ? req.query.page : (req.query.page = 1);
  req.query.take && req.query.take != 0
    ? req.query.take
    : (req.query.take = 10);
  const [data, count] = await model.findAndCount({
    where: { is_deleted: false, ...condition },
    order: order,
    take: req.query.take,
    skip: (req.query.page - 1) * 10,
  });
  let page = 0;
  if (count % req.query.take == 0) {
    page = Math.floor(count / req.query.take);
  } else {
    page = Math.floor(count / req.query.take) + 1;
  }

  return { data, page };
};
