

export const url = 'http://localhost:8000'

export const Loading = ({ type }: { type: string }) => {
  return <>
    {type === "white" && <img src="loading-white.png" alt="loading" className="loading" />}
    {type === "color" && <img src="loading.png" alt="loading" className="loading" />}
  </>

}