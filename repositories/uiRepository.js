const Menu = require("../models/menu");
const Carousel = require("../models/carousel");
const SocialMediaPost = require("../models/socialMediaPost");
const HomePageSection = require("../models/homePageSection");
const ImageLink = require("../models/imageLink");
const { Op } = require("sequelize"); // Import Sequelize operators

// ======= MENUS =======

async function getHeaderMenus(all = false) {
  const whereClause = all
    ? { parent: null }
    : { parent: null, is_visible: true };
  return Menu.findAll({ where: whereClause });
}

async function getSubMenus(parentId, all = false) {
  const whereClause = all
    ? { parent: parentId }
    : { parent: parentId, is_visible: true };
  return Menu.findAll({ where: whereClause });
}

async function createMenu(
  type,
  display,
  payload,
  location,
  parent,
  visible,
  sectionHeader
) {
  const menu = await Menu.create({
    type,
    display,
    payload,
    location,
    parent,
    visible: visible,
    sectionHeader: sectionHeader,
  });
  return menu.id;
}

async function updateMenu(
  id,
  type,
  display,
  payload,
  location,
  parent,
  visible,
  sectionHeader
) {
  const [updatedCount] = await Menu.update(
    {
      type,
      display,
      payload,
      location,
      parent,
      visible,
      subSectionHeader: sectionHeader,
    },
    { where: { id } }
  );
  return updatedCount > 0;
}

async function deleteMenu(id) {
  const deletedCount = await Menu.destroy({
    where: {
      [Op.or]: [{ id }, { parent: id }],
    },
  });
  return deletedCount > 0;
}

async function getMenuById(id) {
  return Menu.findOne({ where: { id } });
}

// ======= CAROUSEL =======

async function getCarousel(id = null) {
  return id ? Carousel.findOne({ where: { id } }) : Carousel.findAll();
}

async function createCarousel(link, images) {
  const carousel = await Carousel.create({
    actionPayload: link,
    imageUrl: images,
  });
  return carousel.id;
}

async function deleteCarousel(id) {
  const deletedCount = await Carousel.destroy({ where: { id } });
  return deletedCount > 0;
}

// ======= SOCIAL MEDIA POSTS =======

async function getSocialPosts() {
  return SocialMediaPost.findAll();
}

async function createSocialPost(
  file,
  video,
  contentType,
  targetLink,
  title,
  description
) {
  const socialPost = await SocialMediaPost.create({
    file: JSON.stringify(file),
    videoFile: video ? JSON.stringify(video) : null,
    contentType,
    targetLink,
    title,
    description,
  });
  return socialPost.id;
}

async function updateSocialPost(
  id,
  file,
  videoFile,
  contentType,
  targetLink,
  title,
  description
) {
  const updateData = { contentType, targetLink, title, description };
  if (file) updateData.file = JSON.stringify(file);
  if (videoFile) updateData.videoFile = JSON.stringify(videoFile);

  const [updatedCount] = await SocialMediaPost.update(updateData, {
    where: { id },
  });
  return updatedCount > 0;
}

async function deleteSocialPost(id) {
  const deletedCount = await SocialMediaPost.destroy({ where: { id } });
  return deletedCount > 0;
}

async function getSocialPostById(id) {
  return SocialMediaPost.findOne({ where: { id } });
}

// ======= HOME PAGE SECTIONS =======

async function getHomePageSections() {
  return HomePageSection.findAll({ order: [["priority", "DESC"]] });
}

async function updateHomePageSection(id, type, title, payload, priority) {
  const [updatedCount] = await HomePageSection.update(
    {
      sectionType: type,
      additionPayload: payload || "",
      heading: title,
      priority,
    },
    { where: { id } }
  );
  return updatedCount > 0;
}

async function deleteHomePageSection(id) {
  const deletedCount = await HomePageSection.destroy({ where: { id } });
  return deletedCount > 0;
}

async function getHomePageSectionById(id) {
  return HomePageSection.findOne({ where: { id } });
}

async function createHomePageSection(type, title, payload, priority) {
  const section = await HomePageSection.create({
    sectionType: type,
    additionPayload: payload || "",
    heading: title,
    priority,
  });
  return section.id;
}

// ======= IMAGE LINKS =======

async function createImageLink(name, image, folder, link, type) {
  const imageLink = await ImageLink.create({
    title: name,
    image,
    folder,
    link,
    displayType: type,
  });
  return imageLink.id > 0;
}

async function deleteImageLink(id) {
  const deletedCount = await ImageLink.destroy({ where: { id } });
  return deletedCount > 0;
}

async function getAllImageLinks() {
  const imageLinks = await ImageLink.findAll({
    order: [["priority", "DESC"]],
  });
  return groupImageLinks(imageLinks);
}

async function getImageLinksByFolder(folder) {
  return ImageLink.findAll({
    where: { folder },
    order: [["priority", "DESC"]],
  });
}

async function setImageLinkOrder(priority, id) {
  const [updatedCount] = await ImageLink.update(
    { priority },
    { where: { id } }
  );
  return updatedCount > 0;
}

async function getImageLinkByID(id) {
  return ImageLink.findOne({ where: { id } });
}

function groupImageLinks(imageLinks) {
  const grouped = {};
  for (const imgLink of imageLinks) {
    if (!grouped[imgLink.folder]) grouped[imgLink.folder] = [];
    grouped[imgLink.folder].push(imgLink);
  }
  return Object.entries(grouped).map(([folder, images]) => ({
    folder,
    images,
  }));
}

// ======= EXPORTS =======

module.exports = {
  // Menus
  getHeaderMenus,
  getSubMenus,
  createMenu,
  updateMenu,
  deleteMenu,
  getMenuById,

  // Carousel
  getCarousel,
  createCarousel,
  deleteCarousel,

  // Social Posts
  getSocialPosts,
  createSocialPost,
  updateSocialPost,
  deleteSocialPost,
  getSocialPostById,

  // Home Page Sections
  getHomePageSections,
  updateHomePageSection,
  deleteHomePageSection,
  getHomePageSectionById,
  createHomePageSection,

  // Image Links
  createImageLink,
  deleteImageLink,
  getAllImageLinks,
  getImageLinksByFolder,
  setImageLinkOrder,
  getImageLinkByID,
};
