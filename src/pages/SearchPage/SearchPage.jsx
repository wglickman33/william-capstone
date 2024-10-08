import { useState, useEffect } from "react";
import Button from "../../components/Button/Button";
import SlidingMenu from "../../components/SlidingMenu/SlidingMenu";
import { fetchItems, fetchFolders } from "../../services/firebaseService.js";
import { useAuth } from "../../context/AuthContext";
import "./SearchPage.scss";

const SearchPage = () => {
  const { currentUser } = useAuth();
  const [folders, setFolders] = useState([]);
  const [items, setItems] = useState([]);
  const [tags, setTags] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [isFoldersOpen, setIsFoldersOpen] = useState(true);
  const [isNameOpen, setIsNameOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isTagsOpen, setIsTagsOpen] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) return;

      try {
        const fetchedFolders = await fetchFolders(currentUser.uid);
        const fetchedItems = await fetchItems(currentUser.uid);

        setFolders(Object.values(fetchedFolders || {}));
        setItems(Object.values(fetchedItems || {}));

        const allTags = [];
        if (fetchedFolders) {
          Object.values(fetchedFolders).forEach((folder) => {
            if (folder.items) {
              Object.values(folder.items).forEach((item) => {
                if (item.customTag) {
                  allTags.push(item.customTag);
                }
              });
            }
          });
        }
        if (fetchedItems) {
          Object.values(fetchedItems).forEach((item) => {
            if (item.customTag) {
              allTags.push(item.customTag);
            }
          });
        }

        setTags([...new Set(allTags)]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadData();
  }, [currentUser]);

  const handleApplyFilters = () => {
    const filteredItems = items.filter((item) => {
      const folderMatch =
        selectedFolders.length === 0 ||
        selectedFolders.includes(item.folderId || "Independent Item");
      const nameMatch =
        selectedNames.length === 0 || selectedNames.includes(item.name);
      const tagMatch =
        selectedTags.length === 0 || selectedTags.includes(item.customTag);

      return folderMatch && nameMatch && tagMatch;
    });

    setFilteredResults(filteredItems);
    setFiltersApplied(true);
  };

  const handleFolderSelection = (folderId) => {
    setSelectedFolders((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleNameSelection = (name) => {
    setSelectedNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleTagSelection = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <main className="search">
      <section className="search__left">
        <div className="search__left-top">
          <h1 className="search__header">Filters</h1>
        </div>
        <div className="search__filters">
          <div className="search__filter-group-container">
            <div
              className="search__filter-group-header"
              onClick={() => setIsFoldersOpen(!isFoldersOpen)}
            >
              <div className="search__filter-title-container">
                <img
                  className="search__filter-icon icon drop-icon"
                  src={
                    isFoldersOpen
                      ? "../../../src/assets/icons/arrow-drop-down.svg"
                      : "../../../src/assets/icons/arrow-drop-up.svg"
                  }
                  alt="Toggle Icon"
                />
                <h3 className="search__filter-title">Folders</h3>
              </div>
            </div>
            {isFoldersOpen && (
              <div className="search__filter-checkbox-list">
                <div className="search__filter-checkbox-container">
                  <input
                    type="checkbox"
                    className="search__filter-checkbox"
                    onChange={() => handleFolderSelection("Independent Item")}
                  />
                  <label className="search__filter-label">
                    Independent Items
                  </label>
                </div>
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="search__filter-checkbox-container"
                  >
                    <input
                      type="checkbox"
                      className="search__filter-checkbox"
                      onChange={() => handleFolderSelection(folder.id)}
                    />
                    <label className="search__filter-label">
                      {folder.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="search__filter-group-container">
            <div
              className="search__filter-group-header"
              onClick={() => setIsNameOpen(!isNameOpen)}
            >
              <div className="search__filter-title-container">
                <img
                  className="search__filter-icon icon drop-icon"
                  src={
                    isNameOpen
                      ? "../../../src/assets/icons/arrow-drop-down.svg"
                      : "../../../src/assets/icons/arrow-drop-up.svg"
                  }
                  alt="Toggle Icon"
                />
                <h3 className="search__filter-title">Name</h3>
              </div>
            </div>
            {isNameOpen && (
              <div className="search__filter-checkbox-list">
                {items.length === 0 ? (
                  <h3 className="search__filter-status-text">
                    No data available
                  </h3>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="search__filter-checkbox-container"
                    >
                      <input
                        type="checkbox"
                        className="search__filter-checkbox"
                        onChange={() => handleNameSelection(item.name)}
                      />
                      <label className="search__filter-label">
                        {item.name}
                      </label>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="search__filter-group-container">
            <div
              className="search__filter-group-header"
              onClick={() => setIsPriceOpen(!isPriceOpen)}
            >
              <div className="search__filter-title-container">
                <img
                  className="search__filter-icon icon drop-icon"
                  src={
                    isPriceOpen
                      ? "../../../src/assets/icons/arrow-drop-down.svg"
                      : "../../../src/assets/icons/arrow-drop-up.svg"
                  }
                  alt="Toggle Icon"
                />
                <h3 className="search__filter-title">Price</h3>
              </div>
            </div>
            {isPriceOpen && (
              <div className="search__filter-range">
                <input
                  type="number"
                  className="search__filter-input"
                  placeholder="Min"
                />
                <input
                  type="number"
                  className="search__filter-input"
                  placeholder="Max"
                />
              </div>
            )}
          </div>
          <div className="search__filter-group-container">
            <div
              className="search__filter-group-header"
              onClick={() => setIsTagsOpen(!isTagsOpen)}
            >
              <div className="search__filter-title-container">
                <img
                  className="search__filter-icon icon drop-icon"
                  src={
                    isTagsOpen
                      ? "../../../src/assets/icons/arrow-drop-down.svg"
                      : "../../../src/assets/icons/arrow-drop-up.svg"
                  }
                  alt="Toggle Icon"
                />
                <h3 className="search__filter-title">Tags</h3>
              </div>
            </div>
            {isTagsOpen && (
              <div className="search__filter-checkbox-list">
                {tags.length === 0 ? (
                  <h3 className="search__filter-status-text">
                    No data available
                  </h3>
                ) : (
                  tags.map((tag, index) => (
                    <div
                      key={index}
                      className="search__filter-checkbox-container"
                    >
                      <input
                        type="checkbox"
                        className="search__filter-checkbox"
                        onChange={() => handleTagSelection(tag)}
                      />
                      <label className="search__filter-label">{tag}</label>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        <div className="search__left-bottom">
          <Button
            className="search__apply-button button--apply"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
        </div>
      </section>
      <section className="search__right">
        <div className="search__right-top">
          <div className="search__header-container">
            <div className="search__logo-container">
              <img
                className="logo search__logo"
                src="../../../src/assets/logos/tori-logo.svg"
                alt="Tori Logo"
              />
            </div>
            <h1 className="search__header">Search</h1>
          </div>
          <div className="search__button-container">
            <Button
              className="button--menu search__button"
              onClick={toggleMenu}
            >
              <img
                className="search__menu-icon icon"
                src="../../../src/assets/icons/menu.svg"
                alt="Menu Icon"
              />
            </Button>
          </div>
        </div>
        <div className="search__content">
          {!filtersApplied ? (
            <>
              <h3 className="search__description">
                Create a list of any item in your inventory using these filters.
              </h3>
              <div className="search__icon-group">
                <div className="search__icon-group-top">
                  <div className="search__icon-item">
                    <div className="search__icon-container">
                      <img
                        className="search__icon icon"
                        src="../../../src/assets/icons/folder.svg"
                        alt="Folder Icon"
                      />
                    </div>
                    <h3 className="search__icon-item-text">Folders</h3>
                  </div>
                  <div className="search__icon-item">
                    <div className="search__icon-container">
                      <img
                        className="search__icon icon"
                        src="../../../src/assets/icons/items.svg"
                        alt="Items Icon"
                      />
                    </div>
                    <h3 className="search__icon-item-text">Name</h3>
                  </div>
                  <div className="search__icon-item">
                    <div className="search__icon-container">
                      <img
                        className="search__icon icon"
                        src="../../../src/assets/icons/money.svg"
                        alt="Price Icon"
                      />
                    </div>
                    <h3 className="search__icon-item-text">Price</h3>
                  </div>
                </div>
                <div className="search__icon-group-bottom">
                  <div className="search__icon-item">
                    <div className="search__icon-container">
                      <img
                        className="search__icon icon"
                        src="../../../src/assets/icons/tags.svg"
                        alt="Tags Icon"
                      />
                    </div>
                    <h3 className="search__icon-item-text">Tags</h3>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="search__results">
              {filteredResults.length === 0 ? (
                <h3 className="search__results-none">
                  No items match your filters.
                </h3>
              ) : (
                <div className="search__table">
                  <div className="search__table-header">
                    <span className="search__table-column">Name</span>
                    <span className="search__table-column">Folder</span>
                    <span className="search__table-column">Tag</span>
                  </div>
                  <div className="search__table-body">
                    {filteredResults.map((item) => (
                      <div key={item.id} className="search__table-row">
                        <span className="search__table-data">{item.name}</span>
                        <span className="search__table-data">
                          {folders.find((f) => f.id === item.folderId)?.name ||
                            "Independent Item"}
                        </span>
                        <span className="search__table-data">
                          {item.customTag || "No Tag"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="search__right-bottom">
          <Button to="/help" className="button--help search__help-button">
            <img
              className="search__help-icon icon"
              src="../../../src/assets/icons/help.svg"
              alt="Help Icon"
            />
            Help
          </Button>
        </div>
      </section>
      <SlidingMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </main>
  );
};

export default SearchPage;
