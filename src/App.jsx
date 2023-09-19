import { BrowserRouter, Routes, Route } from "react-router-dom"

import { Layout } from "./features/layout/Layout"
import { HomePage } from "./features/layout/HomePage"
import { ErrorPage } from "./features/layout/ErrorPage"
import { RecordsPage } from "./features/records/RecordsPage"
import { RecipesPage } from "./features/recipes/RecipesPage"
import { IngredientsPage } from "./features/ingredients/IngredientsPage"
import { AlarmsPage } from "./features/alarms/AlarmsPage"

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/ingredients" element={<IngredientsPage />} />
          <Route path="/alarms" element={<AlarmsPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
