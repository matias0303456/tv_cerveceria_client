import { BrowserRouter, Routes, Route } from "react-router-dom"

import { IngredientsProvider } from "./features/ingredients/IngredientsProvider"
import { UnitsProvider } from "./features/units/UnitsProvider"
import { TypesProvider } from "./features/types/TypesProvider"

import { Layout } from "./features/layout/Layout"
import { ErrorPage } from "./features/layout/ErrorPage"
import { RecordsPage } from "./features/records/RecordsPage"
import { RecipesPage } from "./features/recipes/RecipesPage"
import { IngredientsPage } from "./features/ingredients/IngredientsPage"
import { AlarmsPage } from "./features/alarms/AlarmsPage"

function App() {
  return (
    <IngredientsProvider>
      <UnitsProvider>
        <TypesProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<RecordsPage />} />
                <Route path="/recipes" element={<RecipesPage />} />
                <Route path="/ingredients" element={<IngredientsPage />} />
                <Route path="/alarms" element={<AlarmsPage />} />
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TypesProvider>
      </UnitsProvider>
    </IngredientsProvider>
  )
}

export default App
