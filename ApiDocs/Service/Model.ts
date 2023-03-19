import { getTableColumns } from 'Common/Types/Database/TableColumn';
import Dictionary from 'Common/Types/Dictionary';
import { ExpressRequest, ExpressResponse } from 'CommonServer/Utils/Express';
import ResourceUtil, { ModelDocumentation } from '../Utils/Resources';
import PageNotFoundServiceHandler from './PageNotFound';

const Resources: Array<ModelDocumentation> = ResourceUtil.getResources();
const ResourceDictionary: Dictionary<ModelDocumentation> =
    ResourceUtil.getReosurceDictionaryByPath();

export default class ServiceHandler {
    public static async executeResponse(
        req: ExpressRequest,
        res: ExpressResponse
    ): Promise<void> {
        let pageTitle: string = '';
        let pageDescription: string = '';
        let page: string | undefined = req.params['page'];
        let pageData: any = {};

        if (!page) {
            return PageNotFoundServiceHandler.executeResponse(req, res);
        }

        const currentResource: ModelDocumentation | undefined =
            ResourceDictionary[page];

        if (!currentResource) {
            return PageNotFoundServiceHandler.executeResponse(req, res);
        }

        // Resource Page.
        pageTitle = currentResource.name;
        pageDescription = currentResource.description;
        

        page = 'model';

        pageData.title = currentResource.model.singularName;
        pageData.description = currentResource.model.tableDescription;
        pageData.columns = getTableColumns(currentResource.model);

        return res.render('pages/index', {
            page: page,
            resources: Resources,
            pageTitle: pageTitle,
            pageDescription: pageDescription,
            pageData: pageData,
        });
    }
}
