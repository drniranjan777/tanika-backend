// services/UIService.js
const UploadStatus = require("../utils/uploadStatus"); // Define your upload status codes
const { UploadFailure, DataNotFound } = require("../errors");
const uiRepository = require("../repositories/uiRepository"); // Adjust the path as necessary
const storageDriver = require("../utils/storageDriver"); // Adjust the path as necessary
const { validator } = require("../validators/carouselValidator"); // Adjust the path as necessary
const {
  mapMenuLocationFromOrdinal,
  mapMenuTypeFromOrdinal,
} = require("../utils/mappers");

async function getCarousel() {
  const carousels = await uiRepository.getCarousel();
  return carousels.map((c) => _toCarouselUrl(c));
}

async function deleteCarousel(id) {
  const carousel = await uiRepository.getCarousel(id);
  if (!carousel) return { status: true };

  // Assuming carousel.image is an array of SourceSetImage with image property containing bucket and subPath
  for (const sourceSetImage of carousel.image || []) {
    const { parentFolder, subPath } = sourceSetImage.image;
    await storageDriver.delete(parentFolder, subPath);
  }
  const result = await uiRepository.deleteCarousel(id);
  return { status: result };
}

async function createCarousel(request) {
  await validator.validateCreateCarousel(request);

  const bucketName = "carousel";
  const portraitStatus = await storageDriver.upload(
    bucketName,
    request.portrait.name,
    request.portrait.path
  );
  const landscapeStatus = await storageDriver.upload(
    bucketName,
    request.landscape.name,
    request.landscape.path
  );

  if (
    portraitStatus !== UploadStatus.COMPLETE ||
    landscapeStatus !== UploadStatus.COMPLETE
  ) {
    throw new UploadFailure();
  }

  const portraitUrl = await storageDriver.getPublicLink(
    bucketName,
    request.portrait.name
  );
  const landscapeUrl = await storageDriver.getPublicLink(
    bucketName,
    request.landscape.name
  );

  if (!portraitUrl || !landscapeUrl) throw new DataNotFound();

  const portraitSourceSet = {
    orientation: "PORTRAIT",
    width: "720w",
    image: {
      parentFolder: bucketName,
      subPath: request.portrait.name,
      url: portraitUrl,
    },
  };

  const landscapeSourceSet = {
    orientation: "LANDSCAPE",
    width: "1280w",
    image: {
      parentFolder: bucketName,
      subPath: request.landscape.name,
      url: landscapeUrl,
    },
  };

  const sourceSetImage = [portraitSourceSet, landscapeSourceSet];

  const createdId = await uiRepository.createCarousel(
    request.link,
    JSON.stringify(sourceSetImage)
  );
  return { status: createdId > 0 };
}

async function getSocialMediaPosts() {
  const posts = await uiRepository.getSocialPosts();
  return posts.map((p) => _toSocialMediaPostUrl(p));
}

async function createSocialMediaPost(request) {
  await validator.validateCreateSocialMediaPost(request);

  const bucketName = "social";

  const fileStatus = await storageDriver.upload(
    bucketName,
    request.file.name,
    request.file.path
  );
  const fileLink = await storageDriver.getPublicLink(
    bucketName,
    request.file.name
  );

  let videoFile = null;
  if (request.video) {
    const videoStatus = await storageDriver.upload(
      bucketName,
      request.video.name,
      request.video.path
    );
    const videoLink = await storageDriver.getPublicLink(
      bucketName,
      request.video.name
    );
    if (videoStatus === UploadStatus.COMPLETE && videoLink) {
      videoFile = {
        parentFolder: bucketName,
        subPath: request.video.name,
        url: videoLink,
      };
    }
  }

  if (fileStatus !== UploadStatus.COMPLETE || !fileLink) {
    throw new UploadFailure();
  }

  const remoteImageFile = {
    parentFolder: bucketName,
    subPath: request.file.name,
    url: fileLink,
  };

  const result = await uiRepository.createSocialMediaPost(
    remoteImageFile,
    videoFile,
    request.contentType,
    request.targetLink,
    request.title,
    request.description
  );

  return { status: result > 0 };
}

async function updateSocialMediaPost(request) {
  await validator.validateUpdateSocialMediaPost(request);
  // The Kotlin method currently returns Status(true) directly.
  // You can implement actual update logic here similar to create.
  return { status: true };
}

async function deleteSocialMediaPost(id) {
  const item = await uiRepository.getSocialMediaPostById(id);
  if (!item) return { status: true };

  if (item.file) {
    await storageDriver.delete(item.file.parentFolder, item.file.subPath);
  }
  if (item.video) {
    await storageDriver.delete(item.video.parentFolder, item.video.subPath);
  }

  const result = await uiRepository.deleteSocialMediaPost(id);
  return { status: result };
}

async function getSocialMediaPostById(id) {
  const item = await uiRepository.getSocialMediaPostById(id);
  if (!item) throw new DataNotFound();
  return _toSocialMediaPostUrl(item);
}

async function getHomePageSections() {
  return uiRepository.getHomePageSections();
}

async function getMenus(all) {
  let parentMenus = await uiRepository.getHeaderMenus(all);
  const menuList = await Promise.all(
    parentMenus.map(async (menu) => {
      // Map ordinal values to string labels
      menu.location = mapMenuLocationFromOrdinal(menu.location);
      menu.type = mapMenuTypeFromOrdinal(menu.type);

      // Get submenu items for this parent menu
      const subMenuItems = await uiRepository.getSubMenus(menu.id, all);

      // Group submenu items by sectionHeader
      const sectionSubMenu = Object.entries(
        subMenuItems.reduce((acc, sm) => {
          const section = sm.sectionHeader || "";
          acc[section] = acc[section] || [];
          acc[section].push(sm);
          return acc;
        }, {})
      ).map(([section, menu]) => ({ section, menu }));

      return { parent: menu, subMenu: sectionSubMenu };
    })
  );
  return menuList;
}

async function getHeaderMenus(all) {
  const menus = await getMenus(all);
  return menus.filter((m) => m.parent.location === "HEADER");
}

async function getFooterMenus(all) {
  const menus = await getMenus(all);
  return menus.filter((m) => m.parent.location === "FOOTER");
}

async function deleteHomePageSection(id) {
  const success = await uiRepository.deleteHomePageSection(id);
  return { status: success };
}

async function getHomePageSectionById(id) {
  return uiRepository.getHomePageSectionById(id);
}

async function createHomePageSection(request) {
  await validator.validateCreateHomePageSection(request);
  const id = await uiRepository.createHomePageSection(
    request.type,
    request.title,
    request.payload,
    request.priority
  );
  return { status: id > 0 };
}

async function setImageLink(priority, group, id) {
  const allImageLinksGrouped = await uiRepository.getAllImageLinks();
  // Flatten grouped lists and update priorities accordingly
  const flattened = allImageLinksGrouped
    .filter((g) => g.group === group)
    .flatMap((g) => g.links)
    .map((item) => (item.id === id ? { ...item, priority } : item))
    .sort((a, b) => a.priority - b.priority);

  for (let i = 0; i < flattened.length; i++) {
    let item = flattened[i];
    await uiRepository.setImageLinkOrder(i, item.id);
  }

  return { status: true };
}

async function setHPSPriority(priority, id) {
  const sections = await uiRepository.getHomePageSections();
  const updated = sections
    .map((sec) => (sec.id === id ? { ...sec, priority } : sec))
    .sort((a, b) => a.priority - b.priority);

  for (let i = 0; i < updated.length; i++) {
    const section = updated[i];
    await uiRepository.setHomePageSection(i, section.id);
  }
  return { status: true };
}

async function updateHomePageSection(request) {
  await validator.validateUpdateHomePageSection(request);
  const success = await uiRepository.updateHomePageSection(
    request.id,
    request.type,
    request.title,
    request.payload,
    request.priority
  );
  return { status: success };
}

async function createMenu(request) {
  await validator.validateCreateMenu(request);
  const id = await uiRepository.createMenu(
    request.type,
    request.display,
    request.payload,
    request.location,
    request.parent,
    request.visible,
    request.sectionHeader
  );
  return { status: id > 0 };
}

async function updateMenu(request) {
  await validator.validateUpdateMenu(request);
  const success = await uiRepository.updateMenu(
    request.id,
    request.type,
    request.display,
    request.payload,
    request.location,
    request.parent,
    request.visible,
    request.sectionHeader
  );
  return { status: success };
}

async function deleteMenu(id) {
  const success = await uiRepository.deleteMenu(id);
  return { status: success };
}

async function getMenuById(id) {
  return uiRepository.getMenuById(id);
}

async function createImageLink(request) {
  await validator.validateCreateImageLink(request);
  const type = _imageLinkTypeFromOrdinal(request.type) || "ALWAYS_SCROLL";
  const bucketName = `imageLinks/${request.folder}`;

  const uploadStatus = await storageDriver.upload(
    bucketName,
    request.image.name,
    request.image.path
  );
  const imageLinkUrl = await storageDriver.getPublicLink(
    bucketName,
    request.image.name
  );

  if (uploadStatus !== UploadStatus.COMPLETE || !imageLinkUrl) {
    throw new UploadFailure();
  }

  const remoteImageFile = {
    parentFolder: bucketName,
    subPath: request.image.name,
    url: imageLinkUrl,
  };
  const result = await uiRepository.createImageLink(
    request.name,
    JSON.stringify(remoteImageFile),
    request.folder,
    request.link,
    type
  );
  return { status: result };
}

async function deleteImageLink(id) {
  const item = await uiRepository.getImageLinkByID(id);
  if (!item) return { status: true };

  await storageDriver.delete(item.image.parentFolder, item.image.subPath);
  const result = await uiRepository.deleteImageLink(id);
  return { status: result };
}

async function getAllImageLinks() {
  const raw = await uiRepository.getAllImageLinks();
  return _toGroupedImgLinkUrls(raw);
}

async function getImageLinksByFolder(folder) {
  const raw = await uiRepository.getImageLinksByFolder(folder);
  return _toImgLinkUrls(raw);
}

// -- Helper private methods to map domain models --

function _toCarouselUrl(carousel) {
  let images = [];

  try {
    const parsed = JSON.parse(carousel.imageUrl);

    if (Array.isArray(parsed)) {
      images = parsed.map((img) => ({
        orientation: img.orientation || null,
        width: img.width || null,
        image: img?.image?.url || null,
      }));
    }
  } catch (e) {
    console.warn("Invalid JSON in carousel.imageUrl:", e);
    // Optionally handle error, e.g. fallback or logging
  }

  return {
    id: carousel.id,
    payload: carousel.actionPayload || null,
    image: images,
  };
}

function _toSocialMediaPostUrl(post) {
  // Map social media post entity to a DTO with URLs
  return post; // customize as needed
}

function _imageLinkTypeFromOrdinal(ordinal) {
  // Map ordinal integer to your enum string for image link types
  const types = ["ALWAYS_SCROLL", "TYPE2", "TYPE3"]; // adjust per your enum
  return types[ordinal] || null;
}

function _toGroupedImgLinkUrls(groupedImgLinks) {
  // Transform grouped image link lists into API DTOs
  return groupedImgLinks; // customize as needed
}

function _toImgLinkUrls(imgLinks) {
  // Transform image links list into API DTOs
  return imgLinks; // customize as needed
}

module.exports = {
  getCarousel,
  deleteCarousel,
  createCarousel,
  getSocialMediaPosts,
  createSocialMediaPost,
  updateSocialMediaPost,
  deleteSocialMediaPost,
  getSocialMediaPostById,
  getHomePageSections,
  getMenus,
  getHeaderMenus,
  getFooterMenus,
  deleteHomePageSection,
  getHomePageSectionById,
  createHomePageSection,
  setImageLink,
  setHPSPriority,
  updateHomePageSection,
  createMenu,
  updateMenu,
  deleteMenu,
  getMenuById,
  createImageLink,
  deleteImageLink,
  getAllImageLinks,
  getImageLinksByFolder,
  _toCarouselUrl,
  _toSocialMediaPostUrl,
  _imageLinkTypeFromOrdinal,
  _toGroupedImgLinkUrls,
  _toImgLinkUrls,
};
