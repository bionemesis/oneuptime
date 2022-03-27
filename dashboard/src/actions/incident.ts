import BackendAPI from '../api';
import { Dispatch } from 'redux';
import * as types from '../constants/incident';
import errors from '../errors';

//Array of Incidents

export const projectIncidentsRequest = (promise: $TSFixMe) => {
    return {
        type: types.PROJECT_INCIDENTS_REQUEST,
        payload: promise,
    };
};

export const projectIncidentsError = (error: $TSFixMe) => {
    return {
        type: types.PROJECT_INCIDENTS_FAILED,
        payload: error,
    };
};

export const projectIncidentsSuccess = (incidents: $TSFixMe) => {
    return {
        type: types.PROJECT_INCIDENTS_SUCCESS,
        payload: incidents,
    };
};

export const resetProjectIncidents = () => {
    return {
        type: types.PROJECT_INCIDENTS_RESET,
    };
};

// Gets project Incidents
export function getProjectIncidents(
    projectId: $TSFixMe,
    skip: $TSFixMe,
    limit: $TSFixMe
) {
    skip = parseInt(skip);
    limit = parseInt(limit);

    return function (dispatch: Dispatch) {
        let promise = null;
        if (skip >= 0 && limit >= 0) {
            promise = BackendAPI.get(
                `incident/${projectId}/incident?skip=${skip}&limit=${limit}`
            );
        } else {
            promise = BackendAPI.get(`incident/${projectId}/incident`);
        }
        dispatch(projectIncidentsRequest(promise));

        promise.then(
            function (incidents) {
                const data = incidents.data;
                data.projectId = projectId;
                dispatch(projectIncidentsSuccess(data));
            },
            function (error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(projectIncidentsError(errors(error)));
            }
        );
    };
}

//get all icident for a project belonging to a component
export function getProjectComponentIncidents(
    projectId: $TSFixMe,
    componentId: $TSFixMe,
    skip: $TSFixMe,
    limit: $TSFixMe
) {
    skip = parseInt(skip);
    limit = parseInt(limit);

    return function (dispatch: Dispatch) {
        let promise = null;
        if (skip >= 0 && limit >= 0) {
            promise = BackendAPI.get(
                `incident/${projectId}/incidents/${componentId}?skip=${skip}&limit=${limit}`
            );
        } else {
            promise = BackendAPI.get(
                `incident/${projectId}/incidents/${componentId}`
            );
        }
        dispatch(projectIncidentsRequest(promise));

        promise.then(
            function (incidents) {
                const data = incidents.data;

                data.count = incidents.data.data.count;

                data.data = incidents.data.data.incidents;
                data.projectId = projectId;
                dispatch(projectIncidentsSuccess(data));
            },
            function (error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(projectIncidentsError(errors(error)));
            }
        );
    };
}

// SubProjects Incidents

export const incidentsRequest = (promise: $TSFixMe) => {
    return {
        type: types.INCIDENTS_REQUEST,
        payload: promise,
    };
};

export const incidentsError = (error: $TSFixMe) => {
    return {
        type: types.INCIDENTS_FAILED,
        payload: error,
    };
};

export const incidentsSuccess = (incidents: $TSFixMe) => {
    return {
        type: types.INCIDENTS_SUCCESS,
        payload: incidents,
    };
};

export const resetIncidents = () => {
    return {
        type: types.INCIDENTS_RESET,
    };
};

// Gets project Incidents
export const getIncidents = (projectId: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.get(`incident/${projectId}`);
        dispatch(incidentsRequest(promise));

        promise.then(
            function (incidents) {
                dispatch(incidentsSuccess(incidents.data));
            },
            function (error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(incidentsError(errors(error)));
            }
        );
    };
};
//get component incidents
export function getComponentIncidents(
    projectId: $TSFixMe,
    componentId: $TSFixMe
) {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.get(
            `incident/${projectId}/${componentId}/incidents`
        );
        dispatch(incidentsRequest(promise));

        promise.then(
            function (incidents) {
                dispatch(incidentsSuccess(incidents.data));
            },
            function (error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(incidentsError(errors(error)));
            }
        );
    };
}

// Create a new incident

export const createIncidentRequest = (projectId: $TSFixMe) => {
    return {
        type: types.CREATE_INCIDENT_REQUEST,
        payload: projectId,
    };
};

export const createIncidentError = (error: $TSFixMe) => {
    return {
        type: types.CREATE_INCIDENT_FAILED,
        payload: error,
    };
};

export const createIncidentSuccess = (incident: $TSFixMe) => {
    return {
        type: types.CREATE_INCIDENT_SUCCESS,
        payload: incident,
    };
};

export const resetCreateIncident = () => {
    return {
        type: types.CREATE_INCIDENT_RESET,
    };
};

export const createIncidentReset = () => {
    return function (dispatch: Dispatch) {
        dispatch(resetCreateIncident());
    };
};

// Calls the API to create new incident.
export function createNewIncident(
    projectId: $TSFixMe,
    monitors: $TSFixMe,
    incidentType: $TSFixMe,
    title: $TSFixMe,
    description: $TSFixMe,
    incidentPriority: $TSFixMe,
    customFields: $TSFixMe
) {
    return async function (dispatch: Dispatch) {
        const promise = BackendAPI.post(
            `incident/${projectId}/create-incident`,
            {
                monitors,
                projectId,
                incidentType,
                title,
                description,
                incidentPriority,
                customFields,
            }
        );

        dispatch(createIncidentRequest(projectId));

        promise.then(
            function (createIncident) {
                dispatch({
                    type: 'ADD_NEW_INCIDENT_TO_UNRESOLVED',

                    payload: createIncident.data,
                });
                dispatch({
                    type: 'ADD_NEW_INCIDENT_TO_MONITORS',

                    payload: createIncident.data,
                });

                dispatch(createIncidentSuccess(createIncident.data));
            },
            function (error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(createIncidentError(errors(error)));
            }
        );

        return promise;
    };
}

// incident portion

export const incidentRequest = (promise: $TSFixMe) => {
    return {
        type: types.INCIDENT_REQUEST,
        payload: promise,
    };
};

export const incidentError = (error: $TSFixMe) => {
    return {
        type: types.INCIDENT_FAILED,
        payload: error,
    };
};

export const incidentSuccess = (incident: $TSFixMe) => {
    return {
        type: types.INCIDENT_SUCCESS,
        payload: incident,
    };
};

export const resetIncident = () => {
    return {
        type: types.INCIDENT_RESET,
    };
};

export const acknowledgeIncidentRequest = (promise: $TSFixMe) => {
    return {
        type: types.ACKNOWLEDGE_INCIDENT_REQUEST,
        payload: promise,
    };
};

export const resolveIncidentRequest = (promise: $TSFixMe) => {
    return {
        type: types.RESOLVE_INCIDENT_REQUEST,
        payload: promise,
    };
};

export const acknowledgeIncidentSuccess = (incident: $TSFixMe) => {
    return {
        type: types.ACKNOWLEDGE_INCIDENT_SUCCESS,
        payload: incident,
    };
};

export const resolveIncidentSuccess = (incident: $TSFixMe) => {
    return {
        type: types.RESOLVE_INCIDENT_SUCCESS,
        payload: incident,
    };
};

// Calls the API to get the incident to show
export const getIncident = (projectId: $TSFixMe, incidentSlug: $TSFixMe) => {
    //This fucntion will switch to incidentSlug of the params beig passed.
    return function (dispatch: Dispatch) {
        let promise = null;
        promise = BackendAPI.get(
            `incident/${projectId}/incident/${incidentSlug}`
        );
        dispatch(incidentRequest(promise));

        promise.then(
            function (incident) {
                dispatch(incidentSuccess(incident.data));
            },
            function (error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(incidentError(errors(error)));
            }
        );

        return promise;
    };
};

export const addIncident = (incident: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        dispatch(incidentSuccess(incident));
    };
};
// Calls the API to get the incident timeline
export function getIncidentTimeline(
    projectId: $TSFixMe,
    incidentId: $TSFixMe,
    skip: $TSFixMe,
    limit: $TSFixMe
) {
    return function (dispatch: Dispatch) {
        let promise = null;
        promise = BackendAPI.get(
            `incident/${projectId}/timeline/${incidentId}?skip=${skip}&limit=${limit}`
        );
        dispatch(incidentTimelineRequest(promise));

        promise.then(
            function (timeline) {
                dispatch(incidentTimelineSuccess(timeline.data));
            },
            function (error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(incidentTimelineError(errors(error)));
            }
        );
    };
}

export const incidentTimelineRequest = (promise: $TSFixMe) => {
    return {
        type: types.INCIDENT_TIMELINE_REQUEST,
        payload: promise,
    };
};

export const incidentTimelineSuccess = (timeline: $TSFixMe) => {
    return {
        type: types.INCIDENT_TIMELINE_SUCCESS,
        payload: timeline,
    };
};

export const incidentTimelineError = (error: $TSFixMe) => {
    return {
        type: types.INCIDENT_TIMELINE_FAILED,
        payload: error,
    };
};

export const setActiveIncident = (incidentId: $TSFixMe) => {
    return {
        type: 'SET_ACTIVE_INCIDENT',
        payload: incidentId,
    };
};

// calls the api to post acknowledgement data to the database
export function acknowledgeIncident(
    projectId: $TSFixMe,
    incidentId: $TSFixMe,
    userId: $TSFixMe,
    multiple: $TSFixMe
) {
    //This fucntion will switch to incidentId of the params beig passed.
    return function (dispatch: Dispatch) {
        let promise = null;
        const data = {
            decoded: userId,
            projectId,
            incidentId,
        };

        dispatch(setActiveIncident(incidentId));

        promise = BackendAPI.post(
            `incident/${projectId}/acknowledge/${incidentId}`,
            data
        );
        if (multiple) {
            dispatch(
                acknowledgeIncidentRequest({
                    multiple: true,
                    promise: promise,
                })
            );
        } else {
            dispatch(
                acknowledgeIncidentRequest({
                    multiple: false,
                    promise: promise,
                })
            );
        }

        promise.then(
            function (result) {
                if (multiple) {
                    dispatch(
                        acknowledgeIncidentSuccess({
                            multiple: true,

                            data: result.data.incident,
                        })
                    );
                } else {
                    dispatch(
                        acknowledgeIncidentSuccess({
                            multiple: false,

                            data: result.data.incident,
                        })
                    );
                }
                dispatch({
                    type: 'ACKNOWLEDGE_INCIDENT_SUCCESS',

                    payload: result.data.incident,
                });
                dispatch(
                    fetchIncidentMessagesSuccess({
                        incidentId: result.data.incident.idNumber, // The incidentID needed is no longer objectID from DB but incident serial ID e.g 1

                        incidentMessages: result.data.data,

                        count: result.data.data.length,

                        type: result.data.type,

                        incidentSlug: result.data.incident.incidentSlug,
                    })
                );
            },
            function (error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                if (multiple) {
                    dispatch(
                        incidentError({
                            multiple: true,
                            error: errors(error),
                        })
                    );
                } else {
                    dispatch(
                        incidentError({
                            multiple: false,
                            error: errors(error),
                        })
                    );
                }
            }
        );
        return promise;
    };
}

// calls the api to store the resolve status to the database
export function resolveIncident(
    projectId: $TSFixMe,
    incidentId: $TSFixMe,
    userId: $TSFixMe,
    multiple: $TSFixMe
) {
    //This function will switch to incidentId of the params being passed.
    return function (dispatch: Dispatch) {
        let promise = null;
        const data = {
            decoded: userId,
            projectId,
            incidentId,
        };

        dispatch(setActiveIncident(incidentId));

        promise = BackendAPI.post(
            `incident/${projectId}/resolve/${incidentId}`,
            data
        );
        if (multiple) {
            dispatch(
                resolveIncidentRequest({
                    multiple: true,
                    promise: promise,
                })
            );
        } else {
            dispatch(
                resolveIncidentRequest({
                    multiple: false,
                    promise: promise,
                })
            );
        }

        promise.then(
            function (result) {
                if (multiple) {
                    dispatch(
                        resolveIncidentSuccess({
                            multiple: true,

                            data: result.data.incident,
                        })
                    );
                } else {
                    dispatch(
                        resolveIncidentSuccess({
                            multiple: false,

                            data: result.data.incident,
                        })
                    );
                }
                dispatch({
                    type: 'RESOLVE_INCIDENT_SUCCESS',

                    payload: result.data.incident,
                });
                dispatch(
                    fetchIncidentMessagesSuccess({
                        incidentId: result.data.incident.idNumber, // The incidentID needed is no longer objectID from DB but incident serial ID e.g 1

                        incidentMessages: result.data.data,

                        count: result.data.data.length,

                        type: result.data.type,

                        incidentSlug: result.data.incident.incidentSlug,
                    })
                );
            },
            function (error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                if (multiple) {
                    dispatch(
                        incidentError({
                            multiple: true,
                            error: errors(error),
                        })
                    );
                } else {
                    dispatch(
                        incidentError({
                            multiple: false,
                            error: errors(error),
                        })
                    );
                }
            }
        );
        return promise;
    };
}

export const closeIncidentRequest = (incidentId: $TSFixMe) => {
    return {
        type: types.CLOSE_INCIDENT_REQUEST,
        payload: incidentId,
    };
};

export const closeIncidentError = (error: $TSFixMe) => {
    return {
        type: types.CLOSE_INCIDENT_FAILED,
        payload: error,
    };
};

export const closeIncidentSuccess = (incident: $TSFixMe) => {
    return {
        type: types.CLOSE_INCIDENT_SUCCESS,
        payload: incident,
    };
};

export const closeIncident = (projectId: $TSFixMe, incidentId: $TSFixMe) => {
    //This function will switch to incidentId of the params beig passed.
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.post(
            `incident/${projectId}/close/${incidentId}`,
            {}
        );
        dispatch(closeIncidentRequest(incidentId));

        promise.then(
            function (incident) {
                dispatch(closeIncidentSuccess(incident.data));
            },
            function (error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(closeIncidentError(errors(error)));
            }
        );
    };
};

// Unresolved Incidents Section

export const UnresolvedIncidentsRequest = (promise: $TSFixMe) => {
    return {
        type: types.UNRESOLVED_INCIDENTS_REQUEST,
        payload: promise,
    };
};

export const UnresolvedIncidentsError = (error: $TSFixMe) => {
    return {
        type: types.UNRESOLVED_INCIDENTS_FAILED,
        payload: error,
    };
};

export const UnresolvedIncidentsSuccess = (incidents: $TSFixMe) => {
    return {
        type: types.UNRESOLVED_INCIDENTS_SUCCESS,
        payload: incidents,
    };
};

export const resetUnresolvedIncidents = () => {
    return {
        type: types.UNRESOLVED_INCIDENTS_RESET,
    };
};

// Calls the API to register a user.
export const fetchUnresolvedIncidents = (
    projectId: $TSFixMe,
    isHome = false
) => {
    //This fucntion will switch to incidentId of the params beig passed.
    return function (dispatch: Dispatch) {
        let promise = null;

        promise = BackendAPI.get(
            `incident/${projectId}/unresolvedincidents?isHome=${isHome}`
        );

        dispatch(UnresolvedIncidentsRequest(promise));

        promise.then(
            function (incidents) {
                dispatch(UnresolvedIncidentsSuccess(incidents.data));
            },
            function (error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(UnresolvedIncidentsError(errors(error)));
            }
        );
    };
};

// Calls the API to delete incidents after deleting the project
export const deleteProjectIncidents = (projectId: $TSFixMe) => {
    return {
        type: types.DELETE_PROJECT_INCIDENTS,
        payload: projectId,
    };
};

// Internal notes and investigation notes Section

export const investigationNoteRequest = (
    promise: $TSFixMe,
    updated: $TSFixMe
) => {
    return {
        type: types.INVESTIGATION_NOTE_REQUEST,
        payload: { promise, updated },
    };
};

export const investigationNoteError = (error: $TSFixMe, updated: $TSFixMe) => {
    return {
        type: types.INVESTIGATION_NOTE_FAILED,
        payload: { error, updated },
    };
};

export const investigationNoteSuccess = (incidentMessage: $TSFixMe) => {
    return {
        type: types.INVESTIGATION_NOTE_SUCCESS,
        payload: incidentMessage,
    };
};

export function setInvestigationNote(
    projectId: $TSFixMe,
    incidentId: $TSFixMe,
    body: $TSFixMe
) {
    return function (dispatch: Dispatch) {
        let promise = null;

        promise = BackendAPI.post(
            `incident/${projectId}/incident/${incidentId}/message`,
            body
        );

        const isUpdate = body.id ? true : false;

        dispatch(investigationNoteRequest(promise, isUpdate));

        promise.then(
            function (incidents) {
                dispatch(investigationNoteSuccess(incidents.data));
            },
            function (error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(investigationNoteError(errors(error), isUpdate));
            }
        );
        return promise;
    };
}

export const internalNoteRequest = (promise: $TSFixMe, updated: $TSFixMe) => {
    return {
        type: types.INTERNAL_NOTE_REQUEST,
        payload: { promise, updated },
    };
};

export const internalNoteError = (error: $TSFixMe, updated: $TSFixMe) => {
    return {
        type: types.INTERNAL_NOTE_FAILED,
        payload: { error, updated },
    };
};

export const internalNoteSuccess = (incident: $TSFixMe) => {
    return {
        type: types.INTERNAL_NOTE_SUCCESS,
        payload: incident,
    };
};

export function setInternalNote(
    projectId: $TSFixMe,
    incidentId: $TSFixMe,
    body: $TSFixMe
) {
    return function (dispatch: Dispatch) {
        let promise = null;
        promise = BackendAPI.post(
            `incident/${projectId}/incident/${incidentId}/message`,
            body
        );

        const isUpdate = body.id ? true : false;

        dispatch(internalNoteRequest(promise, isUpdate));

        promise.then(
            function (incidents) {
                if (incidents.data.type === 'internal') {
                    dispatch(
                        fetchIncidentMessagesSuccess({
                            incidentId: incidents.data.idNumber,

                            incidentMessages: incidents.data.data,

                            count: incidents.data.data.length,

                            type: incidents.data.type,

                            incidentSlug: incidents.data.incidentSlug,
                        })
                    );
                } else {
                    dispatch(internalNoteSuccess(incidents.data));
                }
            },
            function (error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(internalNoteError(errors(error), isUpdate));
            }
        );
        return promise;
    };
}

export const deleteIncidentSuccess = (incidentId: $TSFixMe) => {
    return {
        type: types.DELETE_INCIDENT_SUCCESS,
        payload: incidentId,
    };
};

export const deleteIncidentRequest = (incidentId: $TSFixMe) => {
    return {
        type: types.DELETE_INCIDENT_REQUEST,
        payload: incidentId,
    };
};

export const deleteIncidentFailure = (error: $TSFixMe) => {
    return {
        type: types.DELETE_INCIDENT_FAILURE,
        payload: error,
    };
};

export const deleteIncidentReset = (error: $TSFixMe) => {
    return {
        type: types.DELETE_INCIDENT_RESET,
        payload: error,
    };
};

//Delete an incident
export const deleteIncident = (projectId: $TSFixMe, incidentId: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        const promise = delete `incident/${projectId}/${incidentId}`;
        dispatch(deleteIncidentRequest(incidentId));

        promise.then(
            function (incident) {
                dispatch(deleteIncidentSuccess(incident.data._id));
            },
            function (error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(
                    deleteIncidentFailure({ error: errors(error), incidentId })
                );
            }
        );

        return promise;
    };
};

function hideIncidentSuccess(data: $TSFixMe) {
    return {
        type: types.HIDE_INCIDENT_SUCCESS,
        payload: data,
    };
}

function hideIncidentFailure(error: $TSFixMe) {
    return {
        type: types.HIDE_INCIDENT_FAILED,
        payload: error,
    };
}

// hide an incident
export const hideIncident = (data: $TSFixMe) => {
    const { hideIncident, incidentId, projectId } = data;
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.put(`incident/${projectId}/${incidentId}`, {
            hideIncident,
        });
        promise.then(
            function (incident) {
                dispatch(hideIncidentSuccess(incident));
            },
            function (error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(
                    hideIncidentFailure({ error: errors(error), incidentId })
                );
            }
        );

        return promise;
    };
};

export function fetchIncidentMessages(
    projectId: $TSFixMe,
    incidentSlug: $TSFixMe,
    skip: $TSFixMe,
    limit: $TSFixMe,
    type = 'investigation'
) {
    skip = parseInt(skip);
    limit = parseInt(limit);
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.get(
            `incident/${projectId}/incident/${incidentSlug}/message?type=${type}&limit=${limit}&skip=${skip}`
        );
        dispatch(
            fetchIncidentMessagesRequest({
                incidentId: incidentSlug,
                type,
                incidentSlug,
            })
        );

        promise.then(
            function (response) {
                dispatch(
                    fetchIncidentMessagesSuccess({
                        incidentId: incidentSlug,

                        incidentMessages: response.data.data,
                        skip,
                        limit,

                        count: response.data.count,
                        type,
                        incidentSlug: incidentSlug,
                    })
                );
            },
            function (error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(
                    fetchIncidentMessagesFailure({
                        incidentId: incidentSlug,
                        error: errors(error),
                        incidentSlug,
                    })
                );
            }
        );

        return promise;
    };
}

export const fetchIncidentMessagesSuccess = (incidentMessages: $TSFixMe) => {
    return {
        type: types.FETCH_INCIDENT_MESSAGES_SUCCESS,
        payload: incidentMessages,
    };
};

export const fetchIncidentMessagesRequest = (incidentId: $TSFixMe) => {
    return {
        type: types.FETCH_INCIDENT_MESSAGES_REQUEST,
        payload: incidentId,
    };
};

export const fetchIncidentMessagesFailure = (error: $TSFixMe) => {
    return {
        type: types.FETCH_INCIDENT_MESSAGES_FAILURE,
        payload: error,
    };
};

export const resetFetchIncidentMessages = () => {
    return {
        type: types.FETCH_INCIDENT_MESSAGES_RESET,
    };
};
export const editIncidentMessageSwitch = (index: $TSFixMe) => {
    return {
        type: types.EDIT_INCIDENT_MESSAGE_SWITCH,
        payload: index,
    };
};

export function deleteIncidentMessage(
    projectId: $TSFixMe,
    incidentId: $TSFixMe,
    incidentMessageId: $TSFixMe
) {
    return function (dispatch: Dispatch) {
        const promise =
            delete `incident/${projectId}/incident/${incidentId}/message/${incidentMessageId}`;
        dispatch(deleteIncidentMessageRequest(incidentMessageId));

        promise.then(
            function (incidentMessage) {
                if (incidentMessage.data.type === 'internal') {
                    dispatch(
                        fetchIncidentMessagesSuccess({
                            incidentId: incidentMessage.data.idNumber,

                            incidentMessages: incidentMessage.data.data,

                            count: incidentMessage.data.data.length,

                            type: incidentMessage.data.type,

                            incidentSlug: incidentMessage.data.incidentSlug,
                        })
                    );
                } else {
                    dispatch(
                        deleteIncidentMessageSuccess(incidentMessage.data)
                    );
                }
            },
            function (error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(
                    deleteIncidentMessageFailure({
                        error: errors(error),
                        incidentMessageId,
                    })
                );
            }
        );

        return promise;
    };
}

export const deleteIncidentMessageSuccess = (
    removedIncidentMessage: $TSFixMe
) => {
    return {
        type: types.DELETE_INCIDENT_MESSAGE_SUCCESS,
        payload: removedIncidentMessage,
    };
};

export const deleteIncidentMessageRequest = (incidentMessageId: $TSFixMe) => {
    return {
        type: types.DELETE_INCIDENT_MESSAGE_REQUEST,
        payload: incidentMessageId,
    };
};

export const deleteIncidentMessageFailure = (error: $TSFixMe) => {
    return {
        type: types.DELETE_INCIDENT_MESSAGE_FAILURE,
        payload: error,
    };
};

export function updateIncident(
    projectId: $TSFixMe,
    incidentId: $TSFixMe,
    incidentType: $TSFixMe,
    title: $TSFixMe,
    description: $TSFixMe,
    incidentPriority: $TSFixMe
) {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.put(
            `incident/${projectId}/incident/${incidentId}/details`,
            {
                incidentType,
                title,
                description,
                incidentPriority,
            }
        );
        dispatch(updateIncidentRequest());

        promise.then(
            function (incident) {
                dispatch(updateIncidentSuccess(incident.data));
            },
            function (error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(updateIncidentFailure(errors(error)));
            }
        );
        return promise;
    };
}

function updateIncidentRequest() {
    return {
        type: types.UPDATE_INCIDENT_REQUEST,
    };
}

function updateIncidentSuccess(data: $TSFixMe) {
    return {
        type: types.UPDATE_INCIDENT_SUCCESS,
        payload: data,
    };
}

function updateIncidentFailure(error: $TSFixMe) {
    return {
        type: types.UPDATE_INCIDENT_FAILED,
        payload: error,
    };
}
