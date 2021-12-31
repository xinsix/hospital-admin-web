import Instance from  "../../utils/http"

/*查询所有*/
export const getAll=params=>Instance.get("/api/sel",params)
