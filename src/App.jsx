import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"

import { IngredientsProvider } from "./features/ingredients/IngredientsProvider"
import { UnitsProvider } from "./features/units/UnitsProvider"
import { TypesProvider } from "./features/types/TypesProvider"

import { Layout } from "./features/layout/Layout"
import { ErrorPage } from "./features/layout/ErrorPage"
import { RecordsPage } from "./features/records/RecordsPage"
import { RecipesPage } from "./features/recipes/RecipesPage"
import { IngredientsPage } from "./features/ingredients/IngredientsPage"
import { RecipesProvider } from "./features/recipes/RecipesProvider"
import { RecordsProvider } from "./features/records/RecordsProvider"
import { AlarmsPage } from "./features/alarms/AlarmsPage"

function App() {
  return (
    <RecordsProvider>
      <RecipesProvider>
        <IngredientsProvider>
          <UnitsProvider>
            <TypesProvider>
              <BrowserRouter>
                <Toaster />
                <Layout>
                  <Routes>
                    <Route path="/asgardiana" element={<RecordsPage />} />
                    <Route path="/asgardiana/recipes" element={<RecipesPage />} />
                    <Route path="/asgardiana/alarms" element={<AlarmsPage />} />
                    <Route path="/asgardiana/ingredients" element={<IngredientsPage />} />
                    <Route path="*" element={<ErrorPage />} />
                  </Routes>
                </Layout>
              </BrowserRouter>
            </TypesProvider>
          </UnitsProvider>
        </IngredientsProvider>
      </RecipesProvider>
    </RecordsProvider>
  )
}

export default App
