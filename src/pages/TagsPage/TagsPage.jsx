import { useState, useEffect } from "react";
import Button from "../../components/Button/Button";
import SlidingMenu from "../../components/SlidingMenu/SlidingMenu";
import { fetchItems, fetchFolders } from "../../services/firebaseService.js";
import { useAuth } from "../../context/AuthContext";
import "./TagsPage.scss";

const TagsPage = () => {
  const { currentUser } = useAuth();
  const [tags, setTags] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleTagsCount, setVisibleTagsCount] = useState(3);

  useEffect(() => {
    const loadTags = async () => {
      if (!currentUser) return;

      try {
        const fetchedFolders = await fetchFolders(currentUser.uid);
        const fetchedItems = await fetchItems(currentUser.uid);

        const allTags = [];

        if (fetchedFolders) {
          Object.values(fetchedFolders).forEach((folder) => {
            if (folder.items) {
              Object.values(folder.items).forEach((item) => {
                if (item.customTag) {
                  allTags.push({
                    tagName: item.customTag,
                    item: item.name,
                    folder: folder.name,
                  });
                }
              });
            }
          });
        }

        if (fetchedItems) {
          Object.values(fetchedItems).forEach((item) => {
            if (item.customTag && !item.folderId) {
              allTags.push({
                tagName: item.customTag,
                item: item.name,
                folder: "Independent Item",
              });
            }
          });
        }

        setTags(allTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    loadTags();
  }, [currentUser]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const showMoreTags = () => {
    setVisibleTagsCount((prevCount) => prevCount + 5);
  };

  return (
    <main className="tags">
      <section className="tags__header-content">
        <div className="tags__header-container">
          <div className="tags__logo-container">
            <img
              className="logo tags__logo"
              src="../../../src/assets/logos/tori-logo.svg"
              alt="Tori Logo"
            />
          </div>
          <h1 className="tags__header">Tags</h1>
        </div>
        <div className="tags__menu">
          <Button
            className="button--menu tags__menu-button"
            onClick={toggleMenu}
          >
            <img
              className="tags__menu-icon icon"
              src="../../../src/assets/icons/menu.svg"
              alt="Menu Icon"
            />
          </Button>
        </div>
      </section>
      {tags.length === 0 ? (
        <div className="tags__body-content">
          <div className="tags__icon-container">
            <img
              className="tags__main-icon icon"
              src="../../../src/assets/icons/tags.svg"
              alt="Tags Icon"
            />
          </div>
          <div className="tags__body">
            <h2 className="tags__body-title">You don't have any tags</h2>
            <h3 className="tags__body-text">
              Click below to redirect to the item page to get started!
            </h3>
          </div>
          <div className="tags__button-container">
            <Button to="/" className="tags__button button--addtag">
              + Add Tag
            </Button>
          </div>
        </div>
      ) : (
        <div className="tags__list">
          <div className="tags__table">
            <div className="tags__table-header">
              <span className="tags__table-column tags__table-column--name">
                Tag Name
              </span>
              <span className="tags__table-column tags__table-column--item">
                From Item
              </span>
              <span className="tags__table-column tags__table-column--folder">
                From Folder
              </span>
              <span className="tags__table-column tags__table-column--actions">
                Actions
              </span>
            </div>
            <div className="tags__table-body">
              {tags.slice(0, visibleTagsCount).map((tag, index) => (
                <div key={index} className="tags__table-row">
                  <span className="tags__table-data tags__table-row--name">
                    {tag.tagName}
                  </span>
                  <span className="tags__table-data tags__table-row--item">
                    {tag.item}
                  </span>
                  <span className="tags__table-data tags__table-row--folder">
                    {tag.folder}
                  </span>
                  <div className="tags__table-data tags__table-row--actions">
                    <img
                      className="tags__icon icon clickable hoverable"
                      src="../../../src/assets/icons/edit.svg"
                      alt="Edit Icon"
                    />
                    <img
                      className="tags__icon icon clickable hoverable"
                      src="../../../src/assets/icons/delete.svg"
                      alt="Delete Icon"
                    />
                  </div>
                </div>
              ))}
            </div>
            {visibleTagsCount < tags.length && (
              <Button
                className="tags__load-more button--more"
                onClick={showMoreTags}
              >
                Show More
              </Button>
            )}
          </div>
        </div>
      )}
      <div className="help">
        <div className="help__button-container">
          <Button to="/help" className="button--help help__button">
            <img
              className="tags__help-icon icon hover-invert"
              src="../../../src/assets/icons/help.svg"
              alt="Help Icon"
            />
            Help
          </Button>
        </div>
      </div>
      <SlidingMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </main>
  );
};

export default TagsPage;
