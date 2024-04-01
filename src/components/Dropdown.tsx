import React, { useState, useMemo, useCallback, ChangeEvent } from 'react';
// import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';
import cn from 'classnames';
import debounce from 'lodash.debounce';

type Props = {
  onSelected: (person: Person | null) => void;
  items: Person[];
  delay: 300;
};

export const Dropdown: React.FC<Props> = ({ onSelected, items, delay }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const applyQueryCallback = debounce((value: string) => {
    setAppliedQuery(value);
  }, delay);

  const applyQuery = useCallback(applyQueryCallback, [applyQueryCallback]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setInputFocused(true);
    onSelected(null);
  };

  const handleSuggestionClick = (person: Person) => {
    setQuery(person.name);
    onSelected(person);
    setInputFocused(false);
  };

  const inputBlur = () => {
    setTimeout(() => {
      setInputFocused(false);
    }, 300);
  };

  const filteredPeople = useMemo(() => {
    return items.filter(person =>
      person.name.trim().toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, items]);

  const isNotFound = !filteredPeople.length;

  return (
    <>
      <div className={cn('dropdown', { 'is-active': inputFocused })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setInputFocused(true)}
            onBlur={inputBlur}
            data-cy="search-input"
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          {!isNotFound && (
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => handleSuggestionClick(person)}
                >
                  <p
                    className={cn({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isNotFound && (
        <div
          className="notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
