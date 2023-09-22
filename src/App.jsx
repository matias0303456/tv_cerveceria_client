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

function App() {
  return (
    <IngredientsProvider>
      <UnitsProvider>
        <TypesProvider>
          <BrowserRouter>
            <Toaster />
            <Layout>
              <Routes>
                <Route path="/" element={<RecordsPage />} />
                <Route path="/recipes" element={<RecipesPage />} />
                <Route path="/ingredients" element={<IngredientsPage />} />
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
