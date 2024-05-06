
const getNewId = async (Model,Model2, userId) => {
  const maxId = userId % 2 === 0 ? await Model2.max('id') : await Model.max('id')
  if(!maxId){
    return userId % 2 === 0 ? 2 : 1
  }
  return maxId + 2

}

module.exports = {getNewId}