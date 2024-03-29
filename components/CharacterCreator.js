// Module imports
import React, { useState } from 'react'
import PropTypes from 'prop-types'





// Local imports
import {
  firebase,
  firebaseApp,
} from '../helpers/firebase'
import CharacterPreview from './CharacterPreview'





/* eslint-disable id-length,no-magic-numbers,no-param-reassign,react-hooks/rules-of-hooks */
const CharacterCreator = ({ onSubmit, ownerID }) => {
  const [gender, setGender] = useState('')
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false)
  const [name, setName] = useState('')
  const [profession, setProfession] = useState('')

  const isValid = name && gender && profession

  const _onSubmit = async event => {
    event.preventDefault()

    if (isValid) {
      const database = firebaseApp.database()

      const firestore = firebaseApp.firestore()
      const characterCollection = firestore.collection('characters')

      setIsCreatingCharacter(true)

      const characterDoc = await characterCollection.add({
        active: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        profession,
        gender,
        name,
        ownerID,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })

      const { id } = characterDoc

      await database.ref(`game/characters/${id}`).set({
        direction: 'right',
        id,
        ownerID,
        status: {
          active: false,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        },
        x: 0,
        y: 0,
      })

      setIsCreatingCharacter(false)

      setTimeout(() => onSubmit(), 500)
    }
  }

  return (
    <section className="character-creator">
      <form onSubmit={_onSubmit}>
        <fieldset>
          <label>Name</label>

          <input
            maxLength="100"
            onChange={({ target: { value } }) => setName(value)}
            placeholder="e.g. Jon Snow"
            required
            type="text"
            value={name} />
        </fieldset>

        <fieldset>
          <label>Gender</label>

          <select
            onChange={({ target: { value } }) => setGender(value)}
            required
            value={gender}>
            <option>Select your gender...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </fieldset>

        <fieldset>
          <label>Class</label>

          <select
            onChange={({ target: { value } }) => setProfession(value)}
            required
            value={profession}>
            <option>Select your class...</option>
            <option value="cleric">Cleric</option>
            <option value="ranger">Ranger</option>
            <option value="rogue">Rogue</option>
            <option value="warrior">Warrior</option>
            <option value="wizard">Wizard</option>
          </select>
        </fieldset>

        <button
          className="primary"
          disabled={!isValid || isCreatingCharacter}
          type="submit">
          {!isCreatingCharacter && (
            <span>Create</span>
          )}

          {isCreatingCharacter && (
            <span>Saving...</span>
          )}
        </button>
      </form>

      <CharacterPreview character={{
        gender,
        name,
        profession,
      }} />
    </section>
  )
}

CharacterCreator.defaultProps = {
  onSubmit: () => {},
}

CharacterCreator.propTypes = {
  onSubmit: PropTypes.func,
  ownerID: PropTypes.string.isRequired,
}
/* eslint-enable id-length,no-magic-numbers,no-param-reassign,react-hooks/rules-of-hooks */





export default CharacterCreator
