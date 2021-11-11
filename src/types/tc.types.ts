import { TmStatuses, TmFormatsIdType, TmFormatsLabelType } from './tm.types';

// ################################################################################ \\
// #                                                                              # \\
// #                                                                              # \\
// #                          Tsuki Complements - Typings                         # \\
// #                                                                              # \\
// #                                                                              # \\
// ################################################################################ \\

/**
 * Páginas parciais.
 * @since 0.2.6
 */
export type PartialPage = {
	id: number;
	title: string;
	status: TmStatuses;
	format: {
		id: TmFormatsIdType;
		label: TmFormatsLabelType;
	} | null;
};
