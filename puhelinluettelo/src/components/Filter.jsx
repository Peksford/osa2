const Filter = ({ newSearch, handleSearchChange }) => {
  return (
    <form>
      <div>
        filter shown with:{' '}
        <input value={newSearch} onChange={handleSearchChange} />
      </div>
    </form>
  )
}

export default Filter
